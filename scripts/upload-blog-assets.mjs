#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cf = join(root, "node_modules/.bin/cf");
const types = {
  ".avif": "image/avif", ".gif": "image/gif", ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".pdf": "application/pdf", ".mp4": "video/mp4",
  ".webm": "video/webm", ".mp3": "audio/mpeg", ".wav": "audio/wav",
};

function runCf(args, env) {
  const result = spawnSync(cf, args, { cwd: root, env, encoding: "utf8" });
  if (result.error) throw new Error("Cloudflare CLI unavailable. Run bun install first.");
  return result;
}

async function uploadEnvironment(accountId) {
  const env = { ...process.env, CLOUDFLARE_ACCOUNT_ID: accountId };
  if (env.CLOUDFLARE_API_TOKEN) return env;
  const status = runCf(["auth", "whoami"], env);
  if (status.status === 0) {
    try {
      if (JSON.parse(status.stdout).authenticated) return env;
    } catch { /* Fall back to an existing Wrangler session below. */ }
  }

  // Reuse an existing, unexpired default Wrangler session without copying its
  // credentials to the repository or printing them. cf has a separate login.
  const paths = [
    join(homedir(), "Library/Preferences/.wrangler/config/default.toml"),
    join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), ".wrangler/config/default.toml"),
    join(homedir(), ".wrangler/config/default.toml"),
  ];
  for (const path of paths) {
    let text;
    try { text = await readFile(path, "utf8"); } catch { continue; }
    const token = text.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
    const expires = text.match(/^expiration_time\s*=\s*"([^"\r\n]+)"/m)?.[1];
    if (token && expires && Date.parse(expires) > Date.now() + 60_000) {
      return { ...env, CLOUDFLARE_API_TOKEN: token };
    }
  }
  throw new Error("Cloudflare login required. Run node_modules/.bin/cf auth login, or set CLOUDFLARE_API_TOKEN with R2 write access. An unexpired default Wrangler login is also supported.");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: bun run blog:upload [--dry-run] <post-slug> <file> [file ...]\nUploads public assets to blog/<slug>/<name>-<sha256-prefix>.<ext>. Prints JSON URLs.\nSupported: AVIF, GIF, JPEG, PNG, SVG, WebP, PDF, MP4, WebM, MP3, WAV. Maximum 25 MiB each.\n--dry-run validates files and prints URLs without authentication or uploads.");
    return;
  }
  const dryRun = args.includes("--dry-run");
  const positional = args.filter((arg) => arg !== "--dry-run");
  const [slug, ...files] = positional;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !files.length) {
    throw new Error("Provide a lowercase kebab-case post slug and at least one file. Use --help for usage.");
  }
  const config = JSON.parse(await readFile(join(root, "blog-assets.json"), "utf8"));
  const base = new URL(config.publicBaseUrl);
  if (base.protocol !== "https:" || base.pathname !== "/" || base.search || base.hash) {
    throw new Error("blog-assets.json must contain an HTTPS origin as publicBaseUrl.");
  }

  // Validate every input before the first upload, so invalid batches do not
  // leave partial uploads. Changed bytes get a new URL; repeated uploads do not.
  const assets = [];
  for (const file of files) {
    const path = resolve(file);
    const info = await stat(path);
    if (!info.isFile() || info.size === 0 || info.size > 25 * 1024 * 1024) {
      throw new Error(`${file}: expected a nonempty file of at most 25 MiB.`);
    }
    const extension = extname(path).toLowerCase();
    const contentType = types[extension];
    if (!contentType || basename(path).startsWith(".")) throw new Error(`${file}: unsupported asset type.`);
    const bytes = await readFile(path);
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const name = basename(path, extname(path)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "asset";
    const key = `blog/${slug}/${name}-${hash}${extension}`;
    assets.push({ path, key, url: `${base.origin}/${key}`, contentType, bytes: bytes.length });
  }
  const env = dryRun ? null : await uploadEnvironment(config.accountId);
  for (const asset of assets) {
    if (!dryRun) {
      console.error(`Uploading ${asset.key}`);
      const result = runCf([
        "r2", "objects", "put", asset.key, "--bucket-name", config.bucket,
        "--file", asset.path, "--content-type", asset.contentType,
      ], env);
      if (result.status !== 0) {
        // Avoid echoing CLI output, which may contain credential diagnostics.
        throw new Error(`Upload failed for ${asset.key} (exit ${result.status}). Check Cloudflare login and R2 permissions. Earlier successful uploads remain in the bucket.`);
      }
      const response = await fetch(asset.url, { method: "HEAD", signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`Uploaded ${asset.key}, but public verification returned HTTP ${response.status}: ${asset.url}`);
    }
    console.log(JSON.stringify({ ...asset, dryRun }));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
