# Portfolio Site Engineering Guide

This file is the working guide for agents and contributors building frontend features and blog content in this repository. Preserve the site's existing visual language unless a task explicitly asks for a redesign.

## Stack and architecture

- Next.js 16 App Router, React 19, and TypeScript with strict mode.
- Tailwind CSS v4, configured through `app/globals.css`; there is no separate Tailwind config file.
- shadcn/ui-style primitives in `components/ui`, using Radix, `class-variance-authority`, and the `cn()` helper from `lib/utils.ts`.
- Geist for body copy and Geist Mono for headings, labels, dates, navigation, and compact UI text.
- Native CSS scroll snap for home-page section movement, plus GSAP and ScrollToPlugin for visual transitions and direct navigation.
- `next-themes` and semantic CSS variables for light/dark mode.
- MDX blog content under `content/blog`, loaded through the manifest in `content/blog/index.ts`.
- The `@/*` alias resolves from the repository root. Prefer it over long relative imports.

## Design language

The portfolio is deliberately restrained and editorial: monochrome, technical, compact, and slightly retro. Its character comes from mono typography, hard edges, thin borders, dithered images, uppercase labels, and selective motion.

Follow these rules:

- Use semantic color utilities such as `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, and `bg-accent`. Do not introduce raw light-only colors when a semantic token will work in both themes.
- Use `dark:bg-black` only where matching the existing full-page canvas is important. Prefer semantic tokens inside reusable components.
- Use `font-mono` for headings, buttons, dates, status labels, and navigation. Keep longer prose in the default Geist sans font.
- Use uppercase text for short navigational labels and display headings. Do not uppercase long descriptions or article body copy.
- Keep controls and content cards square with `rounded-none`. Thin `border` or `border-foreground` outlines are a recurring motif.
- Favor modest type sizes and tight tracking: section titles commonly use `text-xl font-mono tracking-tight font-normal`; page titles use `text-2xl`; article titles use `text-4xl`.
- Keep body copy calm: typically `text-muted-foreground`, `leading-relaxed`, and, where it reads well, `text-justify`.
- Use whitespace instead of decoration. Common page gutters are `px-10`, top spacing is `pt-16`, and the primary desktop content width is `md:max-w-4xl` (articles use `md:max-w-3xl`).
- Use one restrained accent only when it communicates state, as seen in the yellow "IN PROGRESS" and green "COMPLETED" labels.
- Preserve the dithered visual treatment for prominent imagery. Blog cards use `ImageDithering` and reveal original colors on hover; use a normal `next/image` fallback until the shader is visible.

## Building frontend components

### Put code in the right layer

- `app/**/page.tsx`: route composition, route metadata, and server-side data loading.
- `components/parts`: portfolio-specific page sections such as Experience, Skills, Projects, and Blog.
- `components/ui`: reusable, content-agnostic UI primitives. Extend an existing primitive before creating a near-duplicate.
- `components/ai-elements`: specialized visual effects that came from the AI Elements registry.
- `hooks`: reusable browser behavior.
- `lib`: data access and framework-independent helpers.

Do not add a styled-components/emotion dependency. In this repository, “styled components” means React components styled with Tailwind utilities and semantic tokens.

### Component conventions

- Default to a Server Component. Add `"use client"` only when the component uses state, effects, browser APIs, event handlers, animation hooks, `next-themes`, or another client-only dependency.
- Define explicit TypeScript props interfaces. Keep data arrays outside the component when they are static.
- Compose class names with `cn()` when classes are conditional or supplied by callers.
- Reuse `Button`, `Tooltip`, `Marquee`, `HyperText`, and other existing primitives rather than recreating their behavior.
- Use Lucide for general interface icons and `react-icons` for brand/product icons. Give icons an explicit size such as `size-4`.
- Use `next/link` for navigation and `next/image` for normal images. External links should use `target="_blank"` when leaving the portfolio and should have an accessible label when the content is icon-only.
- Preserve keyboard behavior. If an element is interactive, prefer a semantic `button` or link over an `onClick` on a `div`.
- Keep focus states supplied by the shared primitives. Do not remove outlines without providing an equally visible `focus-visible` treatment.

### Layout and responsive behavior

- Start with the mobile layout and enhance at `md:`. The established page shell is:

```tsx
<div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
  <main className="flex min-h-screen w-full flex-col bg-white px-10 pb-32 dark:bg-black md:max-w-4xl">
    {/* page content */}
  </main>
</div>
```

- Use a narrower `md:max-w-3xl` shell for long-form reading.
- Prefer `gap-*`, padding, and grid/flex layout over absolute pixel positioning.
- Match existing breakpoint behavior rather than adding many bespoke media queries. Verify at a narrow phone width and a desktop width.
- Long horizontal collections may use `overflow-x-scroll` or `Marquee`, with soft `from-background to-transparent` edge fades.

### Motion and effects

- Motion should explain entry, hover, or navigation. Avoid adding constant animation to ordinary content.
- The home page owns section entrance animation centrally in `app/page.tsx`. Keep section components animation-free so multiple animation systems do not compete. The current GSAP transition is:

```ts
gsap.fromTo(
  nextContent,
  { autoAlpha: 0, y: 48 * direction },
  { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }
);
```

- Keep GSAP and `ScrollToPlugin` in the home-page orchestration layer. Always scope animations with `gsap.context()` and clean them up with `ctx.revert()`.
- The home page uses a `h-dvh overflow-y-auto snap-y snap-mandatory` container with real `min-h-dvh snap-start snap-always` sections. Do not replace these semantic panels with invisible scroll triggers.
- `IntersectionObserver` tracks the active panel and initiates GSAP content/dither transitions. Button navigation temporarily disables CSS snapping and uses ScrollToPlugin to tween directly to the destination panel before restoring snap behavior.
- Respect `prefers-reduced-motion` for both section animation and direct navigation.
- Expensive shader effects must be viewport-aware. Follow the blog cards' `IntersectionObserver` pattern and render a lightweight fallback while offscreen.
- Respect usability: hover-only information must also be available through focus, visible text, or another non-hover interaction.

### Adding a new home-page section

The home page renders real full-viewport sections inside a native CSS snap container. The header and dither are fixed visual chrome above that container. To add a section:

1. Create the section component in `components/parts` with an `onScrollToNext` callback if it participates in the sequence.
2. Update `SECTION_COUNT` in `app/page.tsx`; the section/content ref arrays derive from it.
3. Add a semantic `<section>` with `min-h-dvh snap-start snap-always`, an accessible label, and the established responsive top padding.
4. Register that section and its inner content in `sectionRefs` and `contentRefs` at the matching index.
5. Wire the previous and next buttons through `scrollToSection()`.
6. Test forward/reverse native snapping, direct button navigation, keyboard scrolling, mobile height, and the final section.

Keep `SECTION_COUNT`, ref indices, rendered section order, and navigation callbacks in sync. Do not add ScrollTrigger or wheel-event interception for section movement; native scrolling owns momentum and snapping.

## Blog system

### How it works

- `content/blog/<slug>.mdx` contains the post body and exports its metadata.
- `content/blog/index.ts` is the public manifest used by the home-page marquee, `/blog`, and `generateStaticParams()`.
- `lib/blog.ts` loads the manifest and dynamically imports the matching MDX module.
- `app/blog/page.tsx` renders the post index.
- `app/blog/[slug]/page.tsx` renders an article and creates page metadata.
- `mdx-components.tsx` supplies the shared visual styles for headings, prose, links, lists, code, quotes, and images.
- `dynamicParams = false`, so a post not present in the manifest does not get a generated route.
- `_placeholder.mdx` exists for the build system. Never edit it into a real post or add it to the manifest.

### Create a blog post

1. Choose a lowercase kebab-case slug, for example `designing-agent-workflows`.
2. Create `content/blog/designing-agent-workflows.mdx` with a named `metadata` export. Use an ISO `YYYY-MM-DD` date.
3. Write the body in ordinary MDX below the metadata. The route already renders the title, description, and date, so do not repeat the post title as an `# h1` at the start of the body.
4. Add an identical metadata entry, plus `slug`, to `blogPosts` in `content/blog/index.ts`.
5. Keep the two metadata copies synchronized. The manifest powers cards and route generation; the MDX export powers the article header and SEO metadata.
6. Run `bun run lint` and `bun run build`, then inspect the blog index and article in both light and dark mode.

Use this template:

```mdx
export const metadata = {
  title: "Designing Reliable Agent Workflows",
  description: "What I learned while turning agent prototypes into dependable product systems.",
  date: "2026-08-17",
  image: "/blog/designing-agent-workflows/cover.webp",
};

Open with a concise paragraph that states the context, the problem, and why it mattered.

## The problem

Explain the constraints and tradeoffs, not only the final implementation.

## What I built

- Describe the important decisions.
- Include measurable outcomes where possible.
- Link to relevant work without exposing confidential information.

## What I learned

End with a clear takeaway that connects the project to broader engineering practice.
```

Then add this object to `blogPosts`:

```ts
{
  slug: "designing-agent-workflows",
  title: "Designing Reliable Agent Workflows",
  description: "What I learned while turning agent prototypes into dependable product systems.",
  date: "2026-08-17",
  image: "/blog/designing-agent-workflows/cover.webp",
},
```

The manifest is sorted newest-first automatically; do not manually implement ordering elsewhere.

### Blog writing and media conventions

- Write in first person, with a concrete engineering narrative: context, constraints, decisions, outcome, and lesson.
- Prefer specific evidence and measured outcomes over broad claims.
- Keep the description to one sentence; it appears on cards and in search/social metadata.
- Use headings to break up longer posts. Start body sections at `##`; reserve `#` for unusual in-article needs because the route already provides the page title.
- Put owned images under `public/blog/<slug>/` and reference them as `/blog/<slug>/<file>`.
- Remote HTTPS images work because `next.config.ts` currently allows remote hosts, but stable, optimized, locally owned assets are preferred. Do not rely on expiring or access-controlled CDN URLs.
- Always provide meaningful image alt text in MDX, for example `![Diagram of the ingestion pipeline](/blog/my-post/pipeline.webp)`.
- Use fenced code blocks for multiline code and inline backticks for identifiers. The shared MDX component map handles presentation.
- If new MDX elements need special styling, update `mdx-components.tsx` so all posts stay consistent rather than styling one post ad hoc.

## Quality checklist

Before handing off frontend changes:

- Run `bun run lint`.
- Run `bun run build` for route, MDX, type, and static-generation validation.
- Check the affected route at mobile and desktop widths.
- Check light and dark themes.
- Verify keyboard focus, link destinations, icon labels, and image alt text.
- Confirm text does not overflow and horizontal scrollers remain usable.
- Confirm animations and shaders clean up correctly and do not render unnecessarily offscreen.
- For a blog post, confirm the slug, filename, manifest entry, MDX metadata, date, and image path all match.

Make the smallest coherent change that fits these patterns. If a requested design intentionally departs from them, keep the departure local and document the reason in the implementation or handoff.
