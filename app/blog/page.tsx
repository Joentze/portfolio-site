import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { ArrowLeftIcon, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/ui/blog-card";

export const metadata = {
  title: "Blog | Joen Tan",
  description: "Thoughts on software engineering, AI, and building products",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen md:max-w-4xl w-full flex-col pb-32 px-10 bg-white dark:bg-black">
        <div className="pt-16">
          <Link href="/">
            <Button variant="ghost" className="rounded-none font-mono text-xs mb-8 -ml-4">
              <ChevronLeft className="size-4" />
              BACK
            </Button>
          </Link>

          <h1 className="text-2xl font-mono tracking-tight mb-2">BLOG</h1>
          <p className="text-muted-foreground mb-12">
            Thoughts on software engineering, AI, and building products.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                image={post.image}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No blog posts yet. Check back soon!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

