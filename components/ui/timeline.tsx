"use client";
import { BorderBeam } from './border-beam';
import { cn } from '@/lib/utils';

interface TimelineEvent {
    date: string
    role: string
    phase: string
    description: string
    completed?: boolean
}

interface TimelineProps {
    className?: string
    events: TimelineEvent[]
}

export function Timeline({ className, events }: TimelineProps) {
    return (
        <div className={cn(" p-12 overflow-x-auto", className)}>
            <div className="min-w-screen  mx-auto relative px-12">
                {/* Timeline Line and Dots */}
                <div className="relative flex items-center">
                    {events.map((event, index) => (
                        <div key={index} className="flex items-center">
                            {/* Connector Line (Before Dot) */}
                            {index > 0 && (
                                <div
                                    className={`h-1 w-48 bg-black dark:bg-white`}
                                />
                            )}

                            {/* Dot and Content Container */}
                            <div className="relative flex flex-col items-center">
                                {/* Timeline Dot */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div
                                        className={`w-6 h-6 border-6 bg-white border-black dark:bg-foreground dark:border-black'
}`}
                                    />
                                    {!event.completed && <BorderBeam
                                        size={40}
                                        initialOffset={20}
                                        className="from-transparent via-foreground to-transparent rounded-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 60,
                                            damping: 20,
                                        }}
                                    />}
                                </div>

                                {/* Event Details (Positioned absolutely below the dot) */}
                                <div className="absolute top-10 w-48 text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{event.date}</p>
                                    <h3 className="text-md font-mono mb-1 leading-tight">{event.phase}</h3>
                                    <p className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed line-clamp-3 justify-center">
                                        {event.role}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed line-clamp-3 justify-center">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                {/* Spacer to ensure absolute content doesn't overflow container height */}
                <div className="h-32" />
            </div>
        </div>
    )
}
