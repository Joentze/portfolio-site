import { Button } from "../ui/button";
import { HyperText } from "../ui/hyper-text";
import BlogMarqueeCard from "../ui/blog-marquee-card";
import { Marquee } from "../ui/marquee";
import { ArrowUpRightIcon, ChevronsDownIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";
import Link from "next/link";
import { blogPosts } from "@/content/blog";

interface BlogProps {
    onScrollToNext: () => void;
}
export default function Blog({ onScrollToNext }: BlogProps) {
    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <HyperText className="text-xl font-mono tracking-tight font-normal ">BLOG</HyperText>
                <Link href="/blog">
                    <Button className='ml-16 font-mono rounded-none hover:italic' >
                        ALL BLOGS
                        <ArrowUpRightIcon className='size-4' />
                    </Button>
                </Link>
            </div>
            <div className="relative mt-4">
                <div
                    className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-r"
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-l"
                />
                <Marquee className="[--duration:40s]" pauseOnHover>
                    {blogPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <BlogMarqueeCard
                                title={post.title}
                                description={post.description}
                                image={post.image}
                                dateString={post.date}
                            />
                        </Link>
                    ))}
                </Marquee>
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
                <Button
                    className="my-auto rounded-none text-xs"
                    variant="ghost"
                    onClick={onScrollToNext}>
                    <ChevronsDownIcon className='size-4' />
                    <Shimmer duration={8}>SEE SKILLS</Shimmer>
                </Button>
            </div>
        </div>
    )
}
