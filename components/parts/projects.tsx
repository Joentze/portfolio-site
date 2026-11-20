import { HyperText } from "../ui/hyper-text";
import { Button } from "../ui/button";
import { ArrowUpRightIcon, ChevronsDownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Shimmer } from "../ai-elements/shimmer";

interface ProjectsProps {
    onScrollToNext: () => void;
}

export default function Projects({ onScrollToNext }: ProjectsProps) {
    const [projectIndex, setProjectIndex] = useState(0);
    const isMobile = useIsMobile();
    const projects = [
        {
            inProgress: true,
            url: 'https://onword.ai',
            name: 'ONWORD AI',
            description: "Onword AI is a platform that allows users to create and manage apps with AI agents through OAuth-authorised MCPs. I deployed a version of the app for an organisation and recevied 2.4k in revenue. I'm currently expanding Onword's capabilities to include more features and integrations.",
        },
        {
            inProgress: false,
            url: null,
            name: 'CHAD BOD',
            description: 'SMU Chad Bod is a RAG-chat Telegram bot that allows users to ask questions about the university and receive answers from a knowledge base. I built the bot using the OpenAI API and the Telegram Bot API and wanted it to function like a digital companion for new students.',
        },
        {
            inProgress: false,
            url: null,
            name: 'CROFT',
            description: 'Croft is a no-code web scraping platform that allows analyst to scrape data for websites by pre-defining properties to extract. I built Croft in a pre-ChatGPT era and provisioned my own Chromium worker nodes with a queue system to scale extraction jobs via asynchronous processing.',
        },
    ];
    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <HyperText className="text-xl font-mono tracking-tight font-normal ">PROJECTS</HyperText>
                <Button className='ml-16 font-mono rounded-none hover:italic' >
                    ALL PROJECTS
                    <ArrowUpRightIcon className='size-4' />
                </Button>
            </div>

            <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-3 gap-4 mt-6 mb-2">
                {/* Project buttons */}
                <div className={cn(
                    "border border-foreground p-4 text-center font-mono tracking-tight text-sm cursor-pointer hover:bg-foreground hover:text-background transition-all duration-300 hover:italic",
                    projectIndex === 0 && "bg-foreground text-background",
                    isMobile ? "col-start-1 row-start-1" : "col-start-1 row-start-1"
                )}
                    onClick={() => setProjectIndex(0)}
                >
                    {projects.length > 0 ? projects[0].name : ''}
                </div>
                <div className={cn(
                    "border border-foreground p-4 text-center font-mono tracking-tight text-sm cursor-pointer hover:bg-foreground hover:text-background transition-all duration-300 hover:italic",
                    projectIndex === 1 && "bg-foreground text-background",
                    isMobile ? "col-start-2 row-start-1" : "col-start-1 row-start-2"
                )}
                    onClick={() => setProjectIndex(1)}
                >
                    {projects.length > 1 ? projects[1].name : ''}
                </div>
                <div className={cn(
                    "border border-foreground p-4 text-center font-mono tracking-tight text-sm cursor-pointer hover:bg-foreground hover:text-background transition-all duration-300 hover:italic",
                    projectIndex === 2 && "bg-foreground text-background",
                    isMobile ? "col-start-3 row-start-1" : "col-start-1 row-start-3"
                )}
                    onClick={() => setProjectIndex(2)}
                >
                    {projects.length > 2 ? projects[2].name : ''}
                </div>

                {/* Project description - layout changes based on mobile/desktop */}
                <div className={cn(
                    "border border-foreground p-2",
                    isMobile ? "row-start-2 row-end-4 col-start-1 col-end-4" : "row-start-1 row-end-4 col-start-2 col-end-4"
                )}>
                    <div className="flex flex-row items-center justify-start h-8">
                        {
                            projects[projectIndex].inProgress && <HyperText className="text-sm font-mono tracking-tight text-foreground bg-yellow-300 text-yellow-800 px-1 py-0.5 m-2 mt-4 font-normal" >
                                IN PROGRESS</HyperText>
                        }
                        {
                            !projects[projectIndex].inProgress && <HyperText className="text-sm font-mono tracking-tight text-foreground bg-green-300 text-green-800 px-1 py-0.5 m-2 mt-4 font-normal" >
                                COMPLETED</HyperText>
                        }
                        {projects[projectIndex].url &&
                            <Link href={projects[projectIndex].url as string} target="_blank" className="ml-auto">
                                <Button variant="ghost" className="rounded-none " size={"icon-sm"}>
                                    <ArrowUpRightIcon className="size-5" />
                                </Button>
                            </Link>}
                    </div>
                    <div className="py-4" >
                        <p className="px-2 pr-4 line-clamp-5 text-justify text-muted-foreground">{projects[projectIndex].description}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center justify-center mt-4">
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
