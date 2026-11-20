"use client";

import { forwardRef } from "react";
import { BorderBeam } from "./border-beam";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  date: string;
  role: string;
  phase: string;
  description: string;
  completed?: boolean;
}

interface TimelineProps {
  className?: string;
  events: TimelineEvent[];
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline({ className, events }, ref) {
    return (
      <div
        ref={ref}
        aria-label="Experience timeline"
        className={cn(
          "w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[calc(50%_-_8rem)] py-12 md:px-[calc(50%_-_12rem)]",
          className
        )}
      >
        <div className="flex w-max items-start" role="list">
          {events.map((event, index) => (
            <div
              key={`${event.date}-${event.phase}`}
              role="listitem"
              data-latest={index === events.length - 1 ? "true" : undefined}
              className="relative flex w-64 shrink-0 snap-center flex-col items-center md:w-96"
            >
              {index < events.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-2.5 h-1 w-full bg-foreground"
                />
              )}

              <div className="relative z-10 shrink-0">
                <div className="size-6 border-[6px] border-black bg-foreground" />
                {!event.completed && (
                  <BorderBeam
                    size={40}
                    initialOffset={20}
                    className="from-transparent via-foreground to-transparent rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 60,
                      damping: 20,
                    }}
                  />
                )}
              </div>

              <div className="mt-6 w-48 text-center">
                <p className="mb-1 text-xs text-gray-400">{event.date}</p>
                <h3 className="mb-1 font-mono text-md leading-tight">
                  {event.phase}
                </h3>
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                  {event.role}
                </p>
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
