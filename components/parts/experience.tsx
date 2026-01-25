"use client";
import { HyperText } from "../ui/hyper-text";
import { motion } from "framer-motion";
import { Timeline } from "../ui/timeline";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowUpRightIcon, ChevronsDownIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

interface ExperienceProps {
    onScrollToNext: () => void
}
export default function Experience({ onScrollToNext }: ExperienceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Use setTimeout to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            if (scrollRef.current) {
                const container = scrollRef.current;

                // Find all flex items containers (each event is in a flex items-center div)
                const timelineEvents = container.querySelectorAll('.flex.items-center');

                if (timelineEvents.length > 0) {
                    // Get the last event element
                    const lastEvent = timelineEvents[timelineEvents.length - 1] as HTMLElement;

                    // Scroll the last event into view, centered horizontally
                    lastEvent.scrollIntoView({
                        behavior: 'instant',
                        inline: 'center',
                        block: 'nearest'
                    });
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            exit={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-row items-center justify-between">
                <HyperText className="text-xl font-mono tracking-tight font-normal ">EXPERIENCES</HyperText>
                <Button className='ml-16 font-mono rounded-none hover:italic' >
                    SEE RESUME
                    <ArrowUpRightIcon className='size-4' />
                </Button>
            </div>
            <div className="relative">
                {/* Left blur overlay */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-black to-transparent bg-gradient-to-r"

                />

                {/* Right blur overlay */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-black to-transparent bg-gradient-to-l"
                />

                <div ref={scrollRef} className="overflow-x-scroll">
                    <Timeline
                        className={cn("w-full",)}
                        events={[
                            {
                                date: '04/2022',
                                phase: 'BIFROST AI',
                                role: 'Software Engineer Intern',
                                description:
                                    'Synth UI, APIs',
                                completed: true,
                            },
                            {
                                date: '06/2024',
                                phase: 'GOVTECH',
                                role: 'Software Engineer Intern',
                                description:
                                    'RAG Pipelines',
                                completed: true,
                            },
                            {
                                date: '05/2025',
                                phase: 'VOLTADE',
                                role: 'Software Engineer Intern',
                                description:
                                    'RBAC/ABAC, AI Agents',
                                completed: true,
                            },
                            {
                                date: '01/2026',
                                phase: 'HTX',
                                role: 'Software Engineer Intern',
                                description:
                                    'Teammate, AI Agents',
                                completed: false,
                            }
                        ]} />
                </div>

            </div>
            <div className="flex flex-row items-center justify-center">
                <Button
                    className="my-auto rounded-none text-xs"
                    variant="ghost"
                    onClick={onScrollToNext}>
                    <ChevronsDownIcon className='size-4' />
                    <Shimmer duration={8}>SEE SKILLS</Shimmer>
                </Button>
            </div>
        </motion.div>
    )
}