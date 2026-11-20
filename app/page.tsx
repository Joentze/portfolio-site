"use client";

import { Dithering } from "@paper-design/shaders-react";
import { Shimmer } from "@/components/ai-elements/shimmer";
import Blog from "@/components/parts/blog";
import Experience from "@/components/parts/experience";
import Skills from "@/components/parts/skills";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import TypingText from "@/components/ui/typing-text";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

gsap.registerPlugin(ScrollToPlugin);

const SECTION_COUNT = 4;

export default function Home() {
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ditherRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>(
    Array(SECTION_COUNT).fill(null)
  );
  const contentRefs = useRef<(HTMLDivElement | null)[]>(
    Array(SECTION_COUNT).fill(null)
  );
  const activeSectionRef = useRef(0);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  const expandedDitherHeight = isMobile ? "50vh" : "42vh";
  const collapsedDitherHeight = isMobile ? "12vh" : "18.5vh";

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    let guardingInitialPosition = true;

    const resetToIntro = () => {
      scroller.scrollTop = 0;
      activeSectionRef.current = 0;
    };

    const guardAgainstRestoration = () => {
      if (guardingInitialPosition && scroller.scrollTop !== 0) {
        resetToIntro();
      }
    };

    resetToIntro();
    scroller.addEventListener("scroll", guardAgainstRestoration);
    window.addEventListener("pageshow", resetToIntro);

    // Browsers may restore a nested element's scroll position after layout
    // and after the first frame. Keep section zero locked briefly, then hand
    // scrolling back to the user.
    const frame = window.requestAnimationFrame(resetToIntro);
    const restorationGuard = window.setTimeout(() => {
      resetToIntro();
      guardingInitialPosition = false;
      scroller.removeEventListener("scroll", guardAgainstRestoration);
    }, 300);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(restorationGuard);
      window.removeEventListener("pageshow", resetToIntro);
      scroller.removeEventListener("scroll", guardAgainstRestoration);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const scrollToSection = (index: number) => {
    const scroller = scrollerRef.current;
    const target = sectionRefs.current[index];
    if (!scroller || !target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    scrollTweenRef.current?.kill();
    gsap.set(scroller, { scrollSnapType: "none" });

    const restoreSnap = () => {
      gsap.set(scroller, { clearProps: "scrollSnapType" });
    };

    scrollTweenRef.current = gsap.to(scroller, {
      scrollTo: {
        y: target.offsetTop,
        autoKill: true,
        onAutoKill: restoreSnap,
      },
      duration: reduceMotion ? 0 : 0.55,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: restoreSnap,
      onInterrupt: restoreSnap,
    });
  };

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const dither = ditherRef.current;
    const sections = sectionRefs.current;
    const contents = contentRefs.current;
    if (!scroller || !dither || sections.some((section) => !section)) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let observer: IntersectionObserver | null = null;
    const ctx = gsap.context(() => {
      gsap.set(contents.slice(1), { autoAlpha: 0, y: 40 });

      observer = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visibleEntry) return;

          const nextIndex = sections.indexOf(
            visibleEntry.target as HTMLElement
          );
          const previousIndex = activeSectionRef.current;
          if (nextIndex < 0) return;

          if (nextIndex === previousIndex) return;

          const direction = nextIndex > previousIndex ? 1 : -1;
          const previousContent = contents[previousIndex];
          const nextContent = contents[nextIndex];
          activeSectionRef.current = nextIndex;

          if (previousContent) {
            gsap.to(previousContent, {
              autoAlpha: 0,
              y: -24 * direction,
              duration: reduceMotion ? 0 : 0.2,
              ease: "power2.out",
              overwrite: true,
            });
          }

          if (nextContent) {
            gsap.fromTo(
              nextContent,
              { autoAlpha: 0, y: 48 * direction },
              {
                autoAlpha: 1,
                y: 0,
                duration: reduceMotion ? 0 : 0.45,
                ease: "power3.out",
                overwrite: true,
              }
            );
          }

          gsap.to(dither, {
            height:
              nextIndex === 0
                ? expandedDitherHeight
                : collapsedDitherHeight,
            duration: reduceMotion ? 0 : 0.5,
            ease: "power3.inOut",
            overwrite: true,
          });
        },
        {
          root: scroller,
          threshold: 0.55,
        }
      );

      sections.forEach((section) => {
        if (section) observer?.observe(section);
      });
    }, mainRef);

    return () => {
      observer?.disconnect();
      scrollTweenRef.current?.kill();
      ctx.revert();
    };
  }, [collapsedDitherHeight, expandedDitherHeight]);

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-black font-sans">
      <main
        ref={mainRef}
        className="relative h-dvh w-full overflow-hidden bg-black md:max-w-4xl"
      >
        <header className="pointer-events-none absolute left-10 right-10 top-0 z-50 flex items-center bg-black pb-10 pt-16">
          <TypingText
            finalText="JOEN TAN"
            className="font-mono text-xl"
            cursorCharacter="_"
            text={["JOEN TAN", "SOFTWARE ENGINEER", "AI ENTHUSIAST"]}
            loop={false}
          />
          <div className="pointer-events-auto ml-auto flex">
            <ButtonGroup>
              <Button asChild variant="ghost" size="icon" className="rounded-none">
                <Link href="https://github.com/joentze" aria-label="Joen Tan on GitHub">
                  <FaGithub className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="rounded-none">
                <Link
                  href="https://www.linkedin.com/in/joen-tan/"
                  aria-label="Joen Tan on LinkedIn"
                >
                  <FaLinkedin className="size-4" />
                </Link>
              </Button>
            </ButtonGroup>
          </div>
        </header>

        <div
          ref={ditherRef}
          className="pointer-events-none absolute left-10 right-10 top-36 z-40 h-[50vh] overflow-hidden md:h-[42vh]"
        >
          <Dithering
            width="100%"
            height="100%"
            colorBack="#000000"
            colorFront="#FFFFFF"
            shape="warp"
            type="4x4"
            size={2.5}
            speed={0.62}
          />
        </div>

        <div
          ref={scrollerRef}
          className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-contain"
          aria-label="Portfolio sections"
          tabIndex={0}
        >
          <section
            ref={(element) => {
              sectionRefs.current[0] = element;
            }}
            className="relative min-h-dvh snap-start snap-always px-10 pt-[calc(9rem+50vh+2rem)] md:pt-[calc(9rem+42vh+2rem)]"
            aria-label="Introduction"
          >
            <div
              ref={(element) => {
                contentRefs.current[0] = element;
              }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-justify text-muted-foreground">
                I&apos;m deeply passionate about building cool products with
                extraordinary impact. I strive to build products that are
                beautiful &amp; functional.
              </p>
              <Button
                className="rounded-none text-xs"
                variant="ghost"
                onClick={() => scrollToSection(1)}
              >
                <ChevronsDownIcon className="size-4" />
                <Shimmer duration={8}>SEE EXPERIENCES</Shimmer>
              </Button>
            </div>
          </section>

          <section
            ref={(element) => {
              sectionRefs.current[1] = element;
            }}
            className="relative min-h-dvh snap-start snap-always px-10 pt-[calc(9rem+12vh+2rem)] md:pt-[calc(9rem+18.5vh+2rem)]"
            aria-label="Experiences"
          >
            <div ref={(element) => { contentRefs.current[1] = element; }}>
              <Experience onScrollToNext={() => scrollToSection(2)} />
            </div>
          </section>

          <section
            ref={(element) => {
              sectionRefs.current[2] = element;
            }}
            className="relative min-h-dvh snap-start snap-always px-10 pt-[calc(9rem+12vh+2rem)] md:pt-[calc(9rem+18.5vh+2rem)]"
            aria-label="Blog"
          >
            <div ref={(element) => { contentRefs.current[2] = element; }}>
              <Blog onScrollToNext={() => scrollToSection(3)} />
            </div>
          </section>

          <section
            ref={(element) => {
              sectionRefs.current[3] = element;
            }}
            className="relative min-h-dvh snap-start snap-always px-10 pt-[calc(9rem+12vh+2rem)] md:pt-[calc(9rem+18.5vh+2rem)]"
            aria-label="Skills"
          >
            <div ref={(element) => { contentRefs.current[3] = element; }}>
              <Skills onBackToTop={() => scrollToSection(0)} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
