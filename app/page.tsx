"use client";

import { Dithering } from '@paper-design/shaders-react';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import TypingText from '@/components/ui/typing-text';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { FaArrowDown, FaGithub, FaLinkedin } from "react-icons/fa6";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronsDownIcon } from 'lucide-react';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const isMobile = useIsMobile()
  const { theme } = useTheme();
  const ditheringRef = useRef(null);
  const chevronRef = useRef(null);
  const triggerRef = useRef(null);
  const triggerPart1Ref = useRef(null);
  const triggerPart2Ref = useRef(null);
  const part1DivRef = useRef(null);
  const part2DivRef = useRef(null);
  const [ditheringHeight, setDitheringHeight] = useState(520);
  const [windowHeight, setWindowHeight] = useState(0);


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
            end: "+=200",
            scrub: 1,
          },

        });

      }

      // Show part 1 when trigger-part-1 becomes predominant
      if (triggerPart1Ref.current && part1DivRef.current && part2DivRef.current) {
        ScrollTrigger.create({
          trigger: triggerPart1Ref.current,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(part1DivRef.current, { opacity: 1, duration: 0.3 });
            gsap.to(part2DivRef.current, { opacity: 0, duration: 0.3 });

          },
          onEnterBack: () => {
            gsap.to(part1DivRef.current, { opacity: 1, duration: 0.3 });
            gsap.to(part2DivRef.current, { opacity: 0, duration: 0.3 });

          },

          onLeave: () => {
            gsap.to(part1DivRef.current, { opacity: 0, duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(part1DivRef.current, { opacity: 0, duration: 0.3 });
          }
        });
      }

      // Show part 2 when trigger-part-2 becomes predominant
      if (triggerPart2Ref.current && part2DivRef.current && part1DivRef.current) {
        ScrollTrigger.create({
          trigger: triggerPart2Ref.current,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(part2DivRef.current, { opacity: 1, duration: 0.3 });
            gsap.to(part1DivRef.current, { opacity: 0, duration: 0.3 });
          },
          onEnterBack: () => {

            gsap.to(part2DivRef.current, { opacity: 1, duration: 0.3 });
            gsap.to(part1DivRef.current, { opacity: 0, duration: 0.3 });
          },
          onLeave: () => {
            gsap.to(part2DivRef.current, { opacity: 0, duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(part2DivRef.current, { opacity: 0, duration: 0.3 });
          }
        });
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
                  <Button variant={'ghost'} size={'icon'}>
                    <FaGithub className='size-4' />
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/joen-tan/">
                  <Button variant={'ghost'} size={'icon'}>
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
            <p className='justify text-muted-foreground'>
              I'm deeply passionate about building cool products with extraordinary impact. I strive to build products that are beautiful & functional.
            </p>
            <p className='text-xs text-muted-foreground flex items-center gap-2 '><ChevronsDownIcon className='size-4' />
              <Shimmer
                duration={8}
              >
                SEE EXPERIENCES
              </Shimmer>
            </p>

          </div>
          <div ref={part1DivRef} className='absolute w-full h-1 bg-red-500 mt-8' style={{ opacity: 0 }}></div>
          <div ref={part2DivRef} className='absolute w-full h-1 bg-blue-500 mt-8' style={{ opacity: 0 }}></div>
        </div>
        <div ref={triggerPart1Ref} className='h-screen' id="trigger-part-1">
        </div>
        <div ref={triggerPart2Ref} className='h-screen' id="trigger-part-2">
        </div>
      </main >
    </div >
  );
}
