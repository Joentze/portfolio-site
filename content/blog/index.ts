// Auto-generated blog posts manifest
// Add new posts here when you create new MDX files

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

// Add entries here when you create actual MDX files in this directory
// Example:
// {
//   slug: "hello-world",
//   title: "Hello World",
//   description: "My first blog post",
//   date: "2026-01-25",
//   image: "https://paper.design/flowers.webp",
// },
export const blogPosts: BlogPostMeta[] = [
  {
    slug: "govtech-llm-systems",
    title: "Scaling LLM Systems in Government at GovTech Singapore",
    description: "Developing robust RAG systems for over 1,000 users in a production government environment.",
    date: "2024-08-20",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
  },
  {
    slug: "voltade-workflow-systems",
    title: "Building Real-World Workflow Systems at Voltade",
    description: "How software decisions directly affect physical operations in pallet manufacturing.",
    date: "2024-05-15",
    image: "https://media.licdn.com/dms/image/v2/D560BAQHVYNy_BtuoSg/company-logo_200_200/company-logo_200_200/0/1708142650995/voltade_logo?e=2147483647&v=beta&t=7l3lycqkJpXxqX07URnkXZqkkyZl2WZ627mieSLtalk",
  },
  {
    slug: "bifrost-ai-foundations",
    title: "Learning Engineering Foundations at Bifrost AI",
    description: "Building design systems and CI/CD pipelines to ensure frontend quality and discipline.",
    date: "2023-12-10",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1964",
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

