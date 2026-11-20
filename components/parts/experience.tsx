"use client";
import { HyperText } from "../ui/hyper-text";
import { Timeline } from "../ui/timeline";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowUpRightIcon, ChevronsDownIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

interface ExperienceProps {
    onScrollToNext: () => void
}
export default function Experience({ onScrollToNext }: ExperienceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let isPinnedToLatest = true;
        const alignLatestExperience = () => {
            if (isPinnedToLatest) {
                container.scrollLeft = container.scrollWidth - container.clientWidth;
            }
        };
        const handleScroll = () => {
            const maximumScroll = container.scrollWidth - container.clientWidth;
            isPinnedToLatest = Math.abs(maximumScroll - container.scrollLeft) < 2;
        };

        const frame = window.requestAnimationFrame(alignLatestExperience);
        const resizeObserver = new ResizeObserver(alignLatestExperience);
        resizeObserver.observe(container);
        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div>
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

                <Timeline
                        ref={scrollRef}
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
                                completed: true,
                            },
                            {
                                date: '08/2026',
                                phase: 'GOVTECH',
                                role: 'Software Engineer',
                                description: '',
                                completed: false,
                            }
                        ]} />

            </div>
            <div className="flex flex-row items-center justify-center">
                <Button
                    className="my-auto rounded-none text-xs"
                    variant="ghost"
                    onClick={onScrollToNext}>
                    <ChevronsDownIcon className='size-4' />
                    <Shimmer duration={8}>READ BLOG</Shimmer>
                </Button>
            </div>
        </div>
    )
}
