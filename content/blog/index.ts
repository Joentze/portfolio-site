// Auto-generated blog posts manifest
// Add new posts here when you create new MDX files

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    description: "My first blog post exploring the world of MDX and Next.js",
    date: "2026-01-25",
    image: "https://paper.design/flowers.webp",
  },
  {
    slug: "building-with-nextjs",
    title: "Building with Next.js",
    description:
      "Exploring the powerful features of Next.js for modern web development",
    date: "2026-01-20",
    image: "https://paper.design/flowers.webp",
  },
  {
    slug: "ai-in-software-development",
    title: "AI in Software Development",
    description:
      "How AI tools are transforming the way we write code and build products",
    date: "2026-01-15",
    image: "https://paper.design/flowers.webp",
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

