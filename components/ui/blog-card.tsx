"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageDithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export default function BlogCard({
  slug,
  title,
  description,
  date,
  image,
}: BlogCardProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
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
    <Link href={`/blog/${slug}`}>
      <div
        ref={cardRef}
        className="group flex flex-col border border-foreground p-4 cursor-pointer hover:shadow-lg active:border-2 transition-all duration-300"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-48 relative mb-4">
          {isVisible ? (
            <ImageDithering
              width={"100%"}
              height={"100%"}
              image={image}
              colorBack={theme === "dark" ? "#000000" : "#F7F7F7"}
              colorFront={theme === "dark" ? "#737373" : "#343434"}
              colorHighlight={theme === "dark" ? "#fafafa" : "#343434"}
              originalColors={isHovered}
              inverted={false}
              type="8x8"
              size={2}
              colorSteps={2}
              fit="cover"
            />
          ) : (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover opacity-50"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono tracking-tight text-muted-foreground">
            {format(new Date(date), "MMM dd, yyyy").toUpperCase()}
          </p>
          <h2 className="text-lg font-mono tracking-tight text-foreground group-hover:underline">
            {title.toUpperCase()}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

