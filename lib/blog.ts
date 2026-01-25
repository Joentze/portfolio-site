import { blogPosts, type BlogPostMeta } from "@/content/blog";

export type { BlogPostMeta as BlogPost };

// Get all posts (already sorted by date in the manifest)
export function getAllPosts(): BlogPostMeta[] {
    return blogPosts;
}

// Get a single post by slug with its MDX content
export async function getPostBySlug(slug: string) {
    const { default: Post, metadata } = await import(
        `@/content/blog/${slug}.mdx`
    );
    return { Post, metadata };
}

// Get all slugs for static generation
export function getAllSlugs(): string[] {
    return blogPosts.map((post) => post.slug);
}
