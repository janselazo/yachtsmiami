"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homepageFrameSequence } from "@/data/video-frames";
import { homepageVideoScroll } from "@/lib/combined-video-scroll";
import { useScrollVideoFrames } from "@/lib/useScrollVideoFrames";

gsap.registerPlugin(ScrollTrigger);

type CombinedScrollVideoProps = {
  sceneEyebrow: string;
  sceneTitle: string;
  sceneTitleAccent?: string;
  sceneTitleAccentClassName?: string;
  sceneDescription: string;
  sceneAlign?: "left" | "right";
};

export function CombinedScrollVideo({
  sceneEyebrow,
  sceneTitle,
  sceneTitleAccent,
  sceneTitleAccentClassName = "italic text-ocean-light",
  sceneDescription,
  sceneAlign = "right",
}: CombinedScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const sceneContentRef = useRef<HTMLDivElement>(null);
  const lineLightRef = useRef<HTMLSpanElement>(null);
  const lineBoldRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sceneIntroRef = useRef<HTMLDivElement>(null);

  const {
    posterSrc,
    posterVisible,
    loadError,
    updateFrameFromProgress,
  } = useScrollVideoFrames({
    sequence: homepageFrameSequence,
    pinRef,
    canvasRef,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const heroContent = heroContentRef.current;
      const sceneContent = sceneContentRef.current;
      const sceneIntro = sceneIntroRef.current;
      const lineLight = lineLightRef.current;
      const lineBold = lineBoldRef.current;
      const accent = accentRef.current;
      const subhead = subheadRef.current;
      const cta = ctaRef.current;

      if (
        !section ||
        !pin ||
        !heroContent ||
        !sceneContent ||
        !sceneIntro ||
        !lineLight ||
        !lineBold ||
        !accent ||
        !subhead ||
        !cta
      ) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const sceneEyebrowEl =
        sceneIntro.querySelector<HTMLElement>("[data-motion-eyebrow]");
      const sceneLines = sceneIntro.querySelectorAll<HTMLElement>(
        "[data-motion-line] .line-inner",
      );
      const sceneAccentEl =
        sceneIntro.querySelector<HTMLElement>("[data-motion-accent]");
      const sceneCopyEl =
        sceneIntro.querySelector<HTMLElement>("[data-motion-copy]");
      const sceneOrigin = sceneAlign === "right" ? "right center" : "left center";
      const sceneSlideX = sceneAlign === "right" ? 28 : -28;

      if (reducedMotion) {
        gsap.set(
          [
            lineLight,
            lineBold,
            accent,
            subhead,
            cta,
            heroContent,
            sceneContent,
            sceneEyebrowEl,
            ...sceneLines,
            sceneAccentEl,
            sceneCopyEl,
          ].filter(Boolean),
          { clearProps: "all" },
        );
        gsap.set(accent, { scaleX: 1 });
        if (sceneAccentEl) gsap.set(sceneAccentEl, { scaleX: 1 });
        gsap.set(sceneContent, { opacity: 1 });
        updateFrameFromProgress(0);
        return;
      }

      gsap.set(lineLight, { yPercent: 110 });
      gsap.set(lineBold, { yPercent: 110 });
      gsap.set(accent, { scaleX: 0 });
      gsap.set(subhead, { opacity: 0, y: 18 });
      gsap.set(cta, { opacity: 0, y: 24 });
      gsap.set(sceneContent, { opacity: 0 });

      if (sceneEyebrowEl) {
        gsap.set(sceneEyebrowEl, {
          opacity: 0,
          x: sceneSlideX * 0.4,
          letterSpacing: "0.42em",
        });
      }
      if (sceneLines.length) gsap.set(sceneLines, { yPercent: 110 });
      if (sceneAccentEl) {
        gsap.set(sceneAccentEl, { scaleX: 0, transformOrigin: sceneOrigin });
      }
      if (sceneCopyEl) {
        gsap.set(sceneCopyEl, {
          opacity: 0,
          y: 28,
          x: sceneSlideX * 0.25,
        });
      }

      const {
        heroContentOutStart,
        sceneContentInStart,
        scrollMultiplier,
      } = homepageVideoScroll;

      const heroTextSpan = heroContentOutStart - 0.06;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.round(scrollMultiplier * 100)}%`,
          pin: pin,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => updateFrameFromProgress(self.progress),
          onEnter: (self) => updateFrameFromProgress(self.progress),
          onRefresh: (self) => updateFrameFromProgress(self.progress),
        },
      });

      timeline
        .to(lineLight, { yPercent: 0, duration: 0.05, ease: "power3.out" }, 0)
        .to(lineBold, { yPercent: 0, duration: 0.05, ease: "power3.out" }, 0.05)
        .to(accent, { scaleX: 1, duration: 0.04, ease: "power2.out" }, 0.11)
        .to(subhead, { opacity: 1, y: 0, duration: 0.04, ease: "power2.out" }, 0.16)
        .to(cta, { opacity: 1, y: 0, duration: 0.04, ease: "power2.out" }, 0.21)
        .to(
          heroContent,
          { opacity: 0, y: -24, duration: heroTextSpan, ease: "power2.in" },
          heroContentOutStart,
        )
        .to(
          sceneContent,
          { opacity: 1, duration: 0.06, ease: "power2.out" },
          sceneContentInStart,
        );

      if (sceneEyebrowEl) {
        timeline.to(
          sceneEyebrowEl,
          {
            opacity: 1,
            x: 0,
            letterSpacing: "0.34em",
            duration: 0.05,
            ease: "power3.out",
          },
          sceneContentInStart,
        );
      }

      if (sceneLines.length) {
        timeline.to(
          sceneLines,
          {
            yPercent: 0,
            duration: 0.06,
            stagger: 0.012,
            ease: "power3.out",
          },
          sceneContentInStart + 0.006,
        );
      }

      if (sceneAccentEl) {
        timeline.to(
          sceneAccentEl,
          { scaleX: 1, duration: 0.04, ease: "power2.out" },
          sceneContentInStart + 0.018,
        );
      }

      if (sceneCopyEl) {
        timeline.to(
          sceneCopyEl,
          { opacity: 1, y: 0, x: 0, duration: 0.05, ease: "power3.out" },
          sceneContentInStart + 0.024,
        );
      }

      requestAnimationFrame(() => updateFrameFromProgress(0));
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [updateFrameFromProgress, sceneAlign] },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative"
      aria-label="Hero and signature experience"
    >
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden bg-abyss"
      >
        <div className="hero-video-media">
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            className={`transition-opacity duration-300 ${
              posterVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <canvas ref={canvasRef} aria-hidden="true" />
        </div>

        {loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ocean-deep/80 px-6 text-center text-sm text-cream-muted">
            Video frames failed to load. Run{" "}
            <code className="mx-1 text-cream">npm run extract-f3-frames</code>.
          </div>
        ) : null}

        <div className="hero-video-overlay absolute inset-0" />
        <div className="hero-video-vignette absolute inset-0" aria-hidden="true" />
        <div className="hero-video-grain absolute inset-0" aria-hidden="true" />

        <div
          ref={heroContentRef}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-24 pt-28 lg:px-10 lg:pb-28 lg:pt-32"
        >
          <div className="hero-copy-block flex flex-col items-start">
            <h1 className="hero-headline">
              <span className="line-mask">
                <span ref={lineLightRef} className="line-inner hero-line-light">
                  Private
                </span>
              </span>
              <span className="line-mask">
                <span ref={lineBoldRef} className="line-inner hero-line-bold">
                  Yacht charters
                </span>
              </span>
            </h1>

            <span ref={accentRef} className="hero-accent" aria-hidden="true" />

            <p ref={subheadRef} className="hero-subhead">
              Blue Paradise · Miami
            </p>
          </div>

          <div ref={ctaRef} className="hero-cta-row flex flex-wrap gap-4">
            <a href="#fleet" className="btn-primary">
              View the fleet
            </a>
            <a href="#book" className="btn-secondary">
              Book your trip
            </a>
          </div>
        </div>

        <div
          ref={sceneContentRef}
          className={`absolute inset-0 z-10 mx-auto flex h-full w-full max-w-7xl items-end px-6 pb-24 pt-32 opacity-0 lg:px-10 lg:pb-28 ${
            sceneAlign === "right" ? "justify-end text-right" : "justify-start"
          }`}
        >
          <div ref={sceneIntroRef} className="max-w-2xl">
            <p className="eyebrow mb-5" data-motion-eyebrow>
              {sceneEyebrow}
            </p>
            <h2 className="display-headline text-cream">
              <span className="line-mask" data-motion-line>
                <span className="line-inner">{sceneTitle}</span>
              </span>
              {sceneTitleAccent ? (
                <span className="line-mask" data-motion-line>
                  <span
                    className={`line-inner ${sceneTitleAccentClassName}`}
                  >
                    {sceneTitleAccent}
                  </span>
                </span>
              ) : null}
            </h2>
            <span
              className={`section-accent ${sceneAlign === "right" ? "section-accent-right" : ""}`}
              data-motion-accent
              aria-hidden="true"
            />
            <p
              className={`section-copy ${sceneAlign === "right" ? "ml-auto" : ""}`}
              data-motion-copy
            >
              {sceneDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
