"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getSignatureSceneFramePath,
  heroFrameSequence,
} from "@/data/video-frames";
import { useScrollVideoFrames } from "@/lib/useScrollVideoFrames";

gsap.registerPlugin(ScrollTrigger);

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mediaLayerRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineLightRef = useRef<HTMLSpanElement>(null);
  const lineBoldRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const {
    posterSrc,
    posterVisible,
    loadError,
    updateFrameFromProgress,
  } = useScrollVideoFrames({
    sequence: heroFrameSequence,
    pinRef,
    canvasRef,
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const mediaLayer = mediaLayerRef.current;
      const handoff = handoffRef.current;
      const content = contentRef.current;
      const lineLight = lineLightRef.current;
      const lineBold = lineBoldRef.current;
      const accent = accentRef.current;
      const subhead = subheadRef.current;
      const cta = ctaRef.current;

      if (
        !section ||
        !pin ||
        !mediaLayer ||
        !handoff ||
        !content ||
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

      if (reducedMotion) {
        gsap.set([lineLight, lineBold, accent, subhead, cta, mediaLayer, handoff], {
          clearProps: "all",
        });
        gsap.set(accent, { scaleX: 1 });
        gsap.set(handoff, { opacity: 0 });
        updateFrameFromProgress(0);
        return;
      }

      gsap.set(lineLight, { yPercent: 110 });
      gsap.set(lineBold, { yPercent: 110 });
      gsap.set(accent, { scaleX: 0 });
      gsap.set(subhead, { opacity: 0, y: 18 });
      gsap.set(cta, { opacity: 0, y: 24 });
      gsap.set(handoff, { opacity: 0, scale: 1.04 });
      gsap.set(mediaLayer, { opacity: 1, scale: 1 });

      const exitStart = 0.82;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.round(heroFrameSequence.scrollMultiplier * 100)}%`,
          pin: pin,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => updateFrameFromProgress(self.progress),
          onEnter: (self) => updateFrameFromProgress(self.progress),
          onRefresh: (self) => updateFrameFromProgress(self.progress),
        },
      });

      timeline
        .to(lineLight, { yPercent: 0, duration: 0.1, ease: "power3.out" }, 0)
        .to(lineBold, { yPercent: 0, duration: 0.1, ease: "power3.out" }, 0.1)
        .to(accent, { scaleX: 1, duration: 0.08, ease: "power2.out" }, 0.22)
        .to(subhead, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.32)
        .to(cta, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.42)
        .to(
          content,
          { opacity: 0.3, y: -28, duration: 0.18, ease: "power1.in" },
          0.72,
        )
        .to(
          mediaLayer,
          {
            opacity: 0,
            scale: 1.05,
            duration: 1 - exitStart,
            ease: "power2.inOut",
          },
          exitStart,
        )
        .to(
          handoff,
          {
            opacity: 1,
            scale: 1,
            duration: 1 - exitStart,
            ease: "power2.inOut",
          },
          exitStart,
        );

      requestAnimationFrame(() => updateFrameFromProgress(0));
    },
    { scope: sectionRef, dependencies: [updateFrameFromProgress] },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative z-[2]"
      aria-label="Hero"
    >
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden bg-abyss"
      >
        <img
          ref={handoffRef}
          src={getSignatureSceneFramePath(0)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0"
        />

        <div
          ref={mediaLayerRef}
          className="absolute inset-0 will-change-[opacity,transform]"
        >
          <img
            src={posterSrc}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              posterVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        </div>

        {loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ocean-deep/80 px-6 text-center text-sm text-cream-muted">
            Video frames failed to load. Run{" "}
            <code className="mx-1 text-cream">npm run extract-frames</code>.
          </div>
        ) : null}

        <div className="scene-overlay absolute inset-0" />

        <div
          ref={contentRef}
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
      </div>
    </section>
  );
}
