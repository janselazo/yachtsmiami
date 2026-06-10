"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pinkYachtFrameSequence } from "@/data/video-frames";
import { useScrollVideoFrames } from "@/lib/useScrollVideoFrames";
import { animateSectionTypography, prefersReducedMotion } from "@/lib/section-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

type ScrollVideoSceneProps = {
  id?: string;
  sequence?: typeof pinkYachtFrameSequence;
  align?: "left" | "right";
  overlay?: "default" | "light" | "hero";
  titleAccentClassName?: string;
};

export function ScrollVideoScene({
  id,
  sequence = pinkYachtFrameSequence,
  align = "left",
  overlay = "default",
  titleAccentClassName = "italic text-pink-soft",
}: ScrollVideoSceneProps) {
  const { locale, t } = useLanguage();
  const scene = t.pinkScene;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  const overlayClass =
    overlay === "hero"
      ? "hero-video-overlay"
      : overlay === "light"
        ? "scene-overlay-light"
        : "scene-overlay";

  const {
    posterSrc,
    loadError,
    onPosterLoad,
    updateFrameFromProgress,
  } = useScrollVideoFrames({
    sequence,
    pinRef,
    canvasRef,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const intro = introRef.current;

      if (!section || !pin || !intro) return;

      const reducedMotion = prefersReducedMotion();

      if (reducedMotion) {
        updateFrameFromProgress(0);
        return;
      }

      animateSectionTypography(intro, {
        align,
        parallax: false,
      });

      const mapProgressToFrames = (progress: number) => {
        updateFrameFromProgress(Math.max(0, Math.min(1, progress)));
      };

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.round(sequence.scrollMultiplier * 100)}%`,
          pin: pin,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => mapProgressToFrames(self.progress),
          onEnter: (self) => mapProgressToFrames(self.progress),
          onRefresh: (self) => mapProgressToFrames(self.progress),
        },
      });

      requestAnimationFrame(() => {
        mapProgressToFrames(0);
        ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef, dependencies: [sequence, updateFrameFromProgress, align] },
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.getAll().find(
      (entry) => entry.trigger === section,
    );

    requestAnimationFrame(() => {
      updateFrameFromProgress(trigger?.progress ?? 0);
      ScrollTrigger.refresh();
    });
  }, [locale, updateFrameFromProgress]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative"
      aria-label={scene.eyebrow}
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
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={onPosterLoad}
          />

          <canvas ref={canvasRef} aria-hidden="true" />
        </div>

        {loadError ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ocean-deep/80 px-6 text-center text-sm text-cream-muted">
            npm run extract-p2-frames
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
              {scene.eyebrow}
            </p>
            <h2 className="display-headline text-cream">
              <span className="line-mask" data-motion-line>
                <span className="line-inner">{scene.title}</span>
              </span>
              {scene.titleAccent ? (
                <span className="line-mask" data-motion-line>
                  <span className={`line-inner ${titleAccentClassName}`}>
                    {scene.titleAccent}
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
              {scene.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
