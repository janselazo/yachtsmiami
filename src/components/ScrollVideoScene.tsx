"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pinkYachtVideoSequence } from "@/data/video-frames";
import { useScrollReady } from "@/lib/scroll-context";
import { useScrollVideoMp4 } from "@/lib/useScrollVideoMp4";
import { prefersReducedMotion } from "@/lib/section-motion";

gsap.registerPlugin(ScrollTrigger);

type ScrollVideoSceneProps = {
  id?: string;
  video?: typeof pinkYachtVideoSequence;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  titleAccentClassName?: string;
  description: string;
  align?: "left" | "right";
  overlay?: "default" | "light" | "hero";
};

export function ScrollVideoScene({
  id,
  video = pinkYachtVideoSequence,
  eyebrow,
  title,
  titleAccent,
  titleAccentClassName = "italic text-ocean-light",
  description,
  align = "left",
  overlay = "default",
}: ScrollVideoSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const scrollReady = useScrollReady();
  const scrollTriggerId = id ? `${id}-scroll-video` : "scroll-video-scene";

  const overlayClass =
    overlay === "hero"
      ? "hero-video-overlay"
      : overlay === "light"
        ? "scene-overlay-light"
        : "scene-overlay";

  const {
    videoRef,
    isReady,
    loadError,
    updateFrameFromProgress,
  } = useScrollVideoMp4({
    src: video.src,
    scrollTriggerId,
    preload: "auto",
  });

  useGSAP(
    () => {
      if (!scrollReady) return;

      const section = sectionRef.current;
      const pin = pinRef.current;
      const intro = introRef.current;

      if (!section || !pin || !intro) return;

      const reducedMotion = prefersReducedMotion();

      if (reducedMotion) {
        updateFrameFromProgress(0);
        return;
      }

      const eyebrowEl = intro.querySelector<HTMLElement>("[data-motion-eyebrow]");
      const lines = intro.querySelectorAll<HTMLElement>(
        "[data-motion-line] .line-inner",
      );
      const accentEl = intro.querySelector<HTMLElement>("[data-motion-accent]");
      const copyEl = intro.querySelector<HTMLElement>("[data-motion-copy]");
      const origin = align === "right" ? "right center" : "left center";
      const slideFromX = align === "right" ? 28 : -28;

      if (eyebrowEl) {
        gsap.set(eyebrowEl, {
          opacity: 0,
          x: slideFromX * 0.4,
          letterSpacing: "0.42em",
        });
      }
      if (lines.length) gsap.set(lines, { yPercent: 110 });
      if (accentEl) {
        gsap.set(accentEl, { scaleX: 0, transformOrigin: origin });
      }
      if (copyEl) {
        gsap.set(copyEl, { opacity: 0, y: 28, x: slideFromX * 0.25 });
      }

      const mapProgressToFrames = (progress: number) => {
        updateFrameFromProgress(Math.max(0, Math.min(1, progress)));
      };

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          id: scrollTriggerId,
          trigger: section,
          start: "top top",
          end: `+=${Math.round(video.scrollMultiplier * 100)}%`,
          pin: pin,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => mapProgressToFrames(self.progress),
          onEnter: (self) => mapProgressToFrames(self.progress),
          onRefresh: (self) => mapProgressToFrames(self.progress),
        },
      });

      if (eyebrowEl) {
        scrollTimeline.to(
          eyebrowEl,
          {
            opacity: 1,
            x: 0,
            letterSpacing: "0.28em",
            duration: 0.08,
            ease: "power3.out",
          },
          0.02,
        );
      }

      if (lines.length) {
        scrollTimeline.to(
          lines,
          {
            yPercent: 0,
            duration: 0.1,
            stagger: 0.015,
            ease: "power3.out",
          },
          0.04,
        );
      }

      if (accentEl) {
        scrollTimeline.to(
          accentEl,
          { scaleX: 1, duration: 0.07, ease: "power2.out" },
          0.1,
        );
      }

      if (copyEl) {
        scrollTimeline.to(
          copyEl,
          { opacity: 1, y: 0, x: 0, duration: 0.08, ease: "power3.out" },
          0.12,
        );
      }

      requestAnimationFrame(() => {
        mapProgressToFrames(0);
        ScrollTrigger.refresh();
      });
    },
    {
      scope: sectionRef,
      dependencies: [scrollReady, video, updateFrameFromProgress, align, id],
      revertOnUpdate: false,
    },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative"
      aria-label={eyebrow}
    >
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden bg-abyss"
      >
        <div className="hero-video-media">
          <video
            ref={videoRef}
            src={video.src}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              isReady ? "opacity-100" : "opacity-70"
            }`}
          />
        </div>

        {loadError ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ocean-deep/80 px-6 text-center text-sm text-cream-muted">
            Scene video failed to load. Check that{" "}
            <code className="mx-1 text-cream">{video.src}</code> is deployed.
          </div>
        ) : null}

        <div className={`${overlayClass} absolute inset-0`} />
        {overlay === "hero" ? (
          <>
            <div className="hero-video-vignette absolute inset-0" aria-hidden="true" />
            <div className="hero-video-grain absolute inset-0" aria-hidden="true" />
          </>
        ) : null}

        <div
          className={`relative z-10 mx-auto flex h-full w-full max-w-7xl items-end px-6 pb-24 pt-32 lg:px-10 lg:pb-28 ${
            align === "right" ? "justify-end text-right" : "justify-start"
          }`}
        >
          <div ref={introRef} className="max-w-2xl">
            <p className="eyebrow mb-5" data-motion-eyebrow>
              {eyebrow}
            </p>
            <h2 className="display-headline text-cream">
              <span className="line-mask" data-motion-line>
                <span className="line-inner">{title}</span>
              </span>
              {titleAccent ? (
                <span className="line-mask" data-motion-line>
                  <span className={`line-inner ${titleAccentClassName}`}>
                    {titleAccent}
                  </span>
                </span>
              ) : null}
            </h2>
            <span
              className={`section-accent ${align === "right" ? "section-accent-right" : ""}`}
              data-motion-accent
              aria-hidden="true"
            />
            <p
              className={`section-copy ${overlay === "light" ? "section-copy-elevated" : ""} ${align === "right" ? "ml-auto" : ""}`}
              data-motion-copy
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
