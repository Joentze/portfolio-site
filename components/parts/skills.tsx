import { HyperText } from "../ui/hyper-text";
import { Marquee } from "../ui/marquee";
import { FaDocker, FaGit, FaNodeJs, FaPython, FaReact } from "react-icons/fa6";
import { SiAwslambda, SiCloudflare, SiCss3, SiExpress, SiFastapi, SiFlask, SiGooglecloud, SiHono, SiHtml5, SiJavascript, SiMongodb, SiMysql, SiNextdotjs, SiPhp, SiPostgresql, SiPrisma, SiRabbitmq, SiRedis, SiSupabase, SiTailwindcss, SiTypescript, SiVercel } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ChevronsUpIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";


const SKILLS: { icon: React.ReactNode, name: string, description: string }[] = [
    {
        icon: <FaReact className="size-12" />,
        name: 'React',
        description: 'React is a JavaScript library for building user interfaces.',
    },
    {
        icon: <FaNodeJs className="size-12" />,
        name: 'Node.js',
        description: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
    },
    {
        icon: <FaPython className="size-12" />,
        name: 'Python',
        description: 'Python is a programming language that lets you work quickly and integrate systems more effectively.',
    },
    {
        icon: <SiJavascript className="size-12" />,
        name: 'JavaScript',
        description: 'JavaScript is a programming language that allows you to implement complex features on web pages.',
    },
    {
        icon: <SiHtml5 className="size-12" />,
        name: 'HTML5',
        description: 'HTML5 is a markup language used for structuring and presenting content on the World Wide Web.',
    },
    {
        icon: <SiCss3 className="size-12" />,
        name: 'CSS3',
        description: 'CSS3 is a style sheet language used for describing the presentation of a document written in HTML.',
    },
    {
        icon: <SiMysql className="size-12" />,
        name: 'MySQL',
        description: 'MySQL is a relational database management system (RDBMS) that uses SQL as its query language.',
    },
    {
        icon: <SiPostgresql className="size-12" />,
        name: 'PostgreSQL',
        description: 'MySQL is a relational database management system (RDBMS) that uses SQL as its query language.',
    },
    {
        icon: <SiMongodb className="size-12" />,
        name: 'MongoDB',
        description: 'MongoDB is a NoSQL database management system that uses JSON-like documents with schemas.',
    },
    {
        icon: <SiRedis className="size-12" />,
        name: 'Redis',
        description: 'Redis is an in-memory data structure store, used as a database, cache and message broker.',
    },
    {
        icon: <SiPhp className="size-12" />,
        name: 'PHP',
        description: 'PHP is a server-side scripting language designed for web development.',
    },
    {
        icon: <SiNextdotjs className="size-12" />,
        name: 'Next.js',
        description: 'Next.js is a React framework for building server-side rendered applications.',
    },
    {
        icon: <SiTailwindcss className="size-12" />,
        name: 'Tailwind CSS',
        description: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.',
    },
    {
        icon: <SiTypescript className="size-12" />,
        name: 'TypeScript',
        description: 'TypeScript is a superset of JavaScript that adds static typing.',
    },
    {
        icon: <FaDocker className="size-12" />,
        name: 'Docker',
        description: 'Docker is a containerization platform for building and deploying applications.',
    },
    {
        icon: <SiExpress className="size-12" />,
        name: 'Express',
        description: 'Express is a web application framework for Node.js.',
    },
    {
        icon: <SiFlask className="size-12" />,
        name: 'Flask',
        description: 'Flask is a micro web framework for Python.',
    },
    {
        icon: <SiFastapi className="size-12" />,
        name: 'FastAPI',
        description: 'FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+.',
    },
    {
        icon: <SiCloudflare className="size-12" />,
        name: 'Cloudflare',
        description: 'Cloudflare is a cloud platform for building and deploying applications.',
    },
    {
        icon: <SiSupabase className="size-12" />,
        name: 'Supabase',
        description: 'Supabase is a modern, fast (high-performance), web framework for building APIs with Python 3.7+.',
    },
    {
        icon: <SiVercel className="size-12" />,
        name: 'Vercel',
        description: 'Vercel is a cloud platform for building and deploying applications.',
    },
    {
        icon: <SiGooglecloud className="size-12" />,
        name: 'Google Cloud',
        description: 'Google Cloud is a cloud platform for building and deploying applications.',
    },
    {
        icon: <SiHono className="size-12" />,
        name: 'Hono',
        description: 'Hono is a web framework for building serverless applications.',
    },
    {
        icon: <SiAwslambda className="size-12" />,
        name: 'AWS Lambda',
        description: 'AWS Lambda is a serverless computing service that lets you run code without provisioning or managing servers.',
    },


    {
        icon: <FaGit className="size-12" />,
        name: 'Git',
        description: 'Git is a distributed version control system for tracking changes in source code.',
    },
    {
        icon: <SiPrisma className="size-12" />,
        name: 'Prisma',
        description: 'Prisma is an open-source database toolkit for Node.js and TypeScript.',
    },
    {
        icon: <SiRabbitmq className="size-12" />,
        name: 'RabbitMQ',
        description: 'RabbitMQ is a message broker for building distributed systems.',
    }
]

interface SkillsProps {
    onBackToTop: () => void
}
export default function Skills({ onBackToTop }: SkillsProps) {
    return (
        <div className="flex flex-col h-96">
            <div className="flex flex-row items-center justify-between">
                <HyperText className="text-xl font-mono tracking-tight font-normal ">SKILLS</HyperText>
            </div>
            <div className="relative">
                <div
                    className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-r"
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none from-background to-transparent bg-gradient-to-l"
                />
                <TooltipProvider>

                    <Marquee className="[--duration:40s]" pauseOnHover>
                        {SKILLS.map((skill) => (
                            <Tooltip key={skill.name}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-row items-center justify-center size-12">
                                        {skill.icon}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="center" className="rounded-none w-42 text-center">
                                    {skill.description}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </Marquee>

                </TooltipProvider>
            </div>
            <p className='text-justify text-muted-foreground my-8'>
                The following are tools that I&apos;ve worked with across different projects and internship. I&apos;m familiar with wide range of databases, frameworks, languages and cloud platforms. I&apos;m always looking to learn more especially if it means I can build something cool with it.
            </p>
            <div className="flex flex-row items-center justify-center mb-auto">
                <Button className="my-auto rounded-none text-xs" variant="ghost" onClick={onBackToTop}>
                    <ChevronsUpIcon className='size-4' />
                    <Shimmer
                        duration={8}
                    >
                        BACK TO TOP
                    </Shimmer>
                </Button>
            </div>
        </div>
    )
}
