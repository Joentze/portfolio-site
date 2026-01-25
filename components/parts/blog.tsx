import { motion } from "motion/react";
import { Button } from "../ui/button";
import { HyperText } from "../ui/hyper-text";
import BlogMarqueeCard from "../ui/blog-marquee-card";
import { Marquee } from "../ui/marquee";
import { ArrowUpRightIcon, ChevronsUpIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

interface BlogProps {
    onScrollToNext: () => void;
}
export default function Blog({ onScrollToNext }: BlogProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-row items-center justify-between">
                <HyperText className="text-xl font-mono tracking-tight font-normal ">BLOG</HyperText>
                <Button className='ml-16 font-mono rounded-none hover:italic' >
                    ALL BLOGS
                    <ArrowUpRightIcon className='size-4' />
                </Button>
            </div>
            <div className="relative mt-4">
                <div
                    className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-r"
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-l"
                />
                <Marquee className="[--duration:40s]" pauseOnHover>
                    <BlogMarqueeCard title="Blog Post 1" description="This is a blog post" image="https://paper.design/flowers.webp" dateString="2026-01-25" link="https://paper.design" />
                    <BlogMarqueeCard title="Blog Post 2" description="This is a blog post" image="https://paper.design/flowers.webp" dateString="2026-01-25" link="https://paper.design" />
                    <BlogMarqueeCard title="Blog Post 3" description="This is a blog post" image="https://paper.design/flowers.webp" dateString="2026-01-25" link="https://paper.design" />
                    <BlogMarqueeCard title="Blog Post 3" description="This is a blog post" image="https://paper.design/flowers.webp" dateString="2026-01-25" link="https://paper.design" />
                </Marquee>
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
                <Button
                    className="my-auto rounded-none text-xs"
                    variant="ghost"
                    onClick={onScrollToNext}>
                    <ChevronsUpIcon className='size-4' />
                    <Shimmer duration={8}>BACK TO TOP</Shimmer>
                </Button>
            </div>
        </motion.div>
    )
}