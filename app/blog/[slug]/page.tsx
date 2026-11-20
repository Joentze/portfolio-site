import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const result = await getPostBySlug(slug);
    if (!result) {
        return {
            title: "Post Not Found",
        };
    }
    return {
        title: `${result.metadata.title} | Joen Tan`,
        description: result.metadata.description,
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    const result = await getPostBySlug(slug);
    if (!result) {
        notFound();
    }

    const { Post, metadata } = result;

    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex min-h-screen md:max-w-3xl w-full flex-col pb-32 px-10 bg-white dark:bg-black">
                <div className="pt-16">
                    <Link href="/blog">
                        <Button
                            variant="ghost"
                            className="rounded-none font-mono text-xs mb-8 -ml-4"
                        >
                            <ArrowLeftIcon className="size-4" />
                            ALL POSTS
                        </Button>
                    </Link>

                    <article>
                        <header className="mb-8 border-b border-border pb-8">
                            <time className="text-sm font-mono text-muted-foreground">
                                {format(new Date(metadata.date), "MMMM dd, yyyy").toUpperCase()}
                            </time>
                            <h1 className="text-4xl font-mono tracking-tight mt-2 mb-4">
                                {metadata.title.toUpperCase()}
                            </h1>
                            <p className="text-muted-foreground">{metadata.description}</p>
                        </header>

                        <div className="prose-custom text-justify">
                            <Post />
                        </div>
                    </article>

                    <footer className="mt-16 pt-8 border-t border-border">
                        <Link href="/blog">
                            <Button
                                variant="ghost"
                                className="rounded-none font-mono text-xs -ml-4"
                            >
                                <ArrowLeftIcon className="size-4" />
                                BACK TO ALL POSTS
                            </Button>
                        </Link>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export const dynamicParams = false;

