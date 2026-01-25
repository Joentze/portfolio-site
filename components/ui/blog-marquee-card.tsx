"use client";
import { ImageDithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface BlogMarqueeCardProps {
    title: string;
    image: string;
    dateString: string;
    description?: string;
    link?: string;
}

export default function BlogMarqueeCard({ title, image, dateString }: BlogMarqueeCardProps) {
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cardElement = cardRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Only render shader when card is actually visible in viewport
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1, // Trigger when at least 10% visible
                rootMargin: "50px" // Start loading slightly before entering viewport
            }
        );

        if (cardElement) {
            observer.observe(cardElement);
        }

        return () => {
            if (cardElement) {
                observer.unobserve(cardElement);
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="flex flex-col w-48 h-64 p-4 border border-foreground gap-2 cursor-pointer hover:shadow-lg active:border-2 transition-all duration-300"
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full h-full relative">
                {isVisible ? (
                    <ImageDithering
                        width={"100%"}
                        height={"100%"}
                        image={image}
                        colorBack={theme === "dark" ? "#000000" : "#F7F7F7"}
                        colorFront={theme === "dark" ? "#737373" : "#343434"}
                        colorHighlight={theme === "dark" ? "#fafafa" : "#343434"}
                        originalColors={isHovered ? true : false}
                        inverted={false}
                        type="8x8"
                        size={2}
                        colorSteps={2}
                        fit="cover"
                    />
                ) : (
                    // Placeholder while not visible - shows the image without shader
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-contain opacity-50"
                        style={{ imageRendering: "pixelated" }}
                    />
                )}
            </div>
            <div className="flex flex-col gap-0">
                <p className="text-sm font-mono tracking-tight text-foreground line-clamp-1">{title.toUpperCase()}</p>
                <p className="text-xs font-mono tracking-tight text-muted-foreground">{dateString}</p>
            </div>
        </div>
    )
}