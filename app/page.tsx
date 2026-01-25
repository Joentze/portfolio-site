"use client";

import { Dithering } from '@paper-design/shaders-react';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import TypingText from '@/components/ui/typing-text';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronsDownIcon } from 'lucide-react';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { cn } from '@/lib/utils';
import Experience from '@/components/parts/experience';
import Skills from '@/components/parts/skills';
import Projects from '@/components/parts/projects';
import Blog from '@/components/parts/blog';

gsap.registerPlugin(ScrollTrigger);

// Define your parts configuration here


export default function Home() {
  const isMobile = useIsMobile()
  const { theme } = useTheme();
  const ditheringRef = useRef(null);
  const chevronRef = useRef(null);
  const [ditheringHeight, setDitheringHeight] = useState(520);
  const [windowHeight, setWindowHeight] = useState(0);


  // Create refs dynamically for all parts
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const [activePart, setActivePart] = useState<number | null>(null);

  // Scroll to part function
  const scrollToPart = (index: number) => {
    triggerRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    // Set initial window height
    setWindowHeight(window.innerHeight);

    // Update window height on resize
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowHeight === 0) return; // Wait for initial window height

    // Calculate heights as a ratio of viewport height
    // Desktop: ~48% of viewport height, Mobile: ~50% of viewport height
    const initialHeightRatio = isMobile ? 0.5 : 0.42;
    const minHeightRatio = isMobile ? 0.12 : 0.185;

    const initialHeight = Math.round(windowHeight * initialHeightRatio);
    const minHeight = Math.round(windowHeight * minHeightRatio);
    setDitheringHeight(initialHeight);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newHeight = initialHeight - (initialHeight - minHeight) * progress;
          setDitheringHeight(newHeight);
        }
      });

      // Fade out chevron on scroll
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          opacity: 0,
          display: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "+=80",
            scrub: 1,
          },
        });
      }

      // Set up ScrollTriggers for all parts dynamically
      const partsCount = 4;
      for (let index = 0; index < partsCount; index++) {
        const triggerEl = triggerRefs.current[index];

        if (triggerEl) {
          ScrollTrigger.create({
            trigger: triggerEl,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
              setActivePart(index);
            },
            onEnterBack: () => {
              setActivePart(index);
            },
            onLeave: () => {
              setActivePart(null);
            },
            onLeaveBack: () => {
              setActivePart(null);
            }
          });
        }
      }
    });

    return () => ctx.revert();
  }, [isMobile, windowHeight]);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex min-h-screen md:max-w-4xl w-full flex-col items-center justify-between pb-32 px-10 bg-white dark:bg-black sm:items-start relative">
        <div className='sticky top-0 w-full z-50 bg-white dark:bg-black '>
          <div className={cn('bottom-0 left-0 w-full flex flex-row items-center py-10 bg-transparent', isMobile ? 'pt-10' : 'pt-16')}>
            <TypingText
              finalText="JOEN TAN"
              className='font-mono text-xl '
              cursorCharacter='_'
              text={["JOEN TAN", "SOFTWARE ENGINEER", "AI ENTHUSIAST"]}
              loop={false}

            />
            <div className="ml-auto flex">
              <ButtonGroup>
                <Link href="https://github.com/joentze">
                  <Button variant={'ghost'} size={'icon'} className='rounded-none'>
                    <FaGithub className='size-4' />
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/joen-tan/">
                  <Button variant={'ghost'} size={'icon'} className='rounded-none'>
                    <FaLinkedin className='size-4' />
                  </Button>
                </Link>
              </ButtonGroup>
            </div>
          </div>
          <Dithering
            ref={ditheringRef}
            width={"100%"}
            height={ditheringHeight}
            colorBack={theme === "dark" ? "#000000" : "#F7F7F7"}
            colorFront={theme === "dark" ? "#EBEBEB" : "#343434"}
            shape="warp"
            type="4x4"
            size={2.5}
            speed={0.62}
          />
          <div ref={chevronRef} className='w-full flex flex-col justify-center items-center gap-6 pt-8'>
            <p className='text-justify text-muted-foreground'>
              I&apos;m deeply passionate about building cool products with extraordinary impact. I strive to build products that are beautiful & functional.
            </p>
            <Button className="my-auto rounded-none text-xs" variant="ghost" onClick={() => triggerRefs.current[0]?.scrollIntoView({ behavior: 'smooth' })}>
              <ChevronsDownIcon className='size-4' />
              <Shimmer
                duration={8}
              >
                SEE EXPERIENCES
              </Shimmer>
            </Button>

          </div>
          {/* Render only the active part */}
          {activePart === 0 && (
            <div className="absolute w-full mt-8">
              <Experience onScrollToNext={() => scrollToPart(1)} />
            </div>
          )}
          {activePart === 1 && (
            <div className="absolute w-full mt-8">
              <Skills onScrollToNext={() => scrollToPart(2)} />
            </div>
          )}
          {activePart === 2 && (
            <div className="absolute w-full mt-8">
              <Projects onScrollToNext={() => scrollToPart(3)} />
            </div>
          )}
          {activePart === 3 && (
            <div className="absolute w-full mt-8">
              <Blog onScrollToNext={() => scrollToPart(0)} />
            </div>
          )}
        </div>
        {/* Render all trigger sections */}
        {[0, 1, 2, 3].map((index) => (
          <div
            key={`part-${index}`}
            ref={(el) => { triggerRefs.current[index] = el; }}
            className={cn('h-screen', index === 3 && 'pb-32')}
            id={`trigger-part-${index}`}
          />
        ))}
      </main >
    </div >
  );
}