import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

// Custom components for MDX content
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Custom heading styles
        h1: ({ children }) => (
            <h1 className="text-4xl font-mono tracking-tight mt-8 mb-4 text-foreground">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-mono tracking-tight mt-8 mb-3 text-foreground">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-mono tracking-tight mt-6 mb-2 text-foreground">
                {children}
            </h3>
        ),
        // Paragraph styling
        p: ({ children }) => (
            <p className="text-base leading-relaxed mb-4 text-foreground/90">
                {children}
            </p>
        ),
        // Link styling
        a: ({ href, children }) => (
            <Link
                href={href ?? "#"}
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
                {children}
            </Link>
        ),
        // Code blocks
        pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-none overflow-x-auto mb-4 font-mono text-sm border border-border">
                {children}
            </pre>
        ),
        code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded-none font-mono text-sm">
                {children}
            </code>
        ),
        // List styling
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/90">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/90">
                {children}
            </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // Blockquote
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-foreground pl-4 italic text-muted-foreground my-4">
                {children}
            </blockquote>
        ),
        // Image with next/image
        img: (props) => (
            <Image
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                className="my-4"
                {...(props as ImageProps)}
                alt={props.alt ?? "Blog image"}
            />
        ),
        // Horizontal rule
        hr: () => <hr className="border-border my-8" />,
        // Strong and emphasis
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ...components,
    };
}

