"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homepageFrameSequence } from "@/data/video-frames";
import { brand } from "@/data/brand";
import {
  homepageVideoScroll,
  videoSecondsToScrollProgress,
} from "@/lib/combined-video-scroll";
import { useScrollVideoFrames } from "@/lib/useScrollVideoFrames";
import { useLanguage } from "@/i18n/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

type CombinedScrollVideoProps = {
  sceneAlign?: "left" | "right";
  sceneTitleAccentClassName?: string;
};

export function CombinedScrollVideo({
  sceneAlign = "right",
  sceneTitleAccentClassName = "italic text-ocean-light",
}: CombinedScrollVideoProps) {
  const { locale, t } = useLanguage();
  const scene = t.signatureScene;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const sceneContentRef = useRef<HTMLDivElement>(null);
  const lineLightRef = useRef<HTMLSpanElement>(null);
  const lineBoldRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sceneIntroRef = useRef<HTMLDivElement>(null);

  const {
    posterSrc,
    loadError,
    onPosterLoad,
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
      const heroCopy = heroCopyRef.current;
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
        !heroCopy ||
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
      const isMobileLayout = window.matchMedia("(max-width: 1023px)").matches;
      const effectiveAlign = isMobileLayout ? "left" : sceneAlign;
      const sceneOrigin = effectiveAlign === "right" ? "right center" : "left center";
      const sceneSlideX = effectiveAlign === "right" ? 28 : -28;

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
        heroCopyLeadSeconds,
      } = homepageVideoScroll;

      const heroTextSpan = 0.06;
      const heroCopyLeadProgress = videoSecondsToScrollProgress(
        heroCopyLeadSeconds,
        homepageFrameSequence.count,
        homepageFrameSequence.fps,
      );
      const heroCopyFadeDuration = 0.05;
      const heroCopyHideEnd = sceneContentInStart - heroCopyLeadProgress;
      const heroCopyHideStart = heroCopyHideEnd - heroCopyFadeDuration;

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
        .to(cta, { opacity: 1, y: 0, duration: 0.04, ease: "power2.out" }, 0.21);

      if (isMobileLayout) {
        timeline
          .to(
            heroCopy,
            {
              opacity: 0,
              y: -20,
              duration: heroCopyFadeDuration,
              ease: "power2.in",
            },
            heroCopyHideStart,
          )
          .to(
            cta,
            { opacity: 0, y: 16, duration: 0.06, ease: "power2.in" },
            sceneContentInStart - 0.1,
          );
      } else {
        timeline.to(
          heroContent,
          { opacity: 0, y: -24, duration: heroTextSpan, ease: "power2.in" },
          heroContentOutStart,
        );
      }

      timeline.to(
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
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={onPosterLoad}
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
          <div
            ref={heroCopyRef}
            className="hero-copy-block flex flex-col items-start"
          >
            <h1 className="hero-headline">
              <span className="line-mask">
                <span ref={lineLightRef} className="line-inner hero-line-light">
                  {t.hero.lineLight}
                </span>
              </span>
              <span className="line-mask">
                <span ref={lineBoldRef} className="line-inner hero-line-bold">
                  {t.hero.lineBold}
                </span>
              </span>
            </h1>

            <span ref={accentRef} className="hero-accent" aria-hidden="true" />

            <p ref={subheadRef} className="hero-subhead">
              {brand.name}
            </p>
          </div>

          <div ref={ctaRef} className="hero-cta-row flex flex-wrap gap-4">
            <a href="#fleet" className="btn-primary">
              {t.hero.viewFleet}
            </a>
            <a href="#book" className="btn-secondary">
              {t.hero.bookTrip}
            </a>
          </div>
        </div>

        <div
          ref={sceneContentRef}
          className={`combined-scene-panel absolute inset-0 z-10 mx-auto flex h-full w-full max-w-7xl items-end px-6 pb-24 pt-32 opacity-0 lg:px-10 lg:pb-28 ${
            sceneAlign === "right"
              ? "lg:justify-end lg:text-right"
              : "lg:justify-start lg:text-left"
          }`}
        >
          <div ref={sceneIntroRef} className="max-w-2xl max-lg:mr-auto">
            <p className="eyebrow mb-5" data-motion-eyebrow>
              {scene.eyebrow}
            </p>
            <h2 className="display-headline text-cream">
              <span className="line-mask" data-motion-line>
                <span className="line-inner">{scene.title}</span>
              </span>
              {scene.titleAccent ? (
                <span className="line-mask" data-motion-line>
                  <span
                    className={`line-inner ${sceneTitleAccentClassName}`}
                  >
                    {scene.titleAccent}
                  </span>
                </span>
              ) : null}
            </h2>
            <span
              className={`section-accent ${sceneAlign === "right" ? "section-accent-right max-lg:ml-0" : ""}`}
              data-motion-accent
              aria-hidden="true"
            />
            <p
              className={`section-copy ${sceneAlign === "right" ? "lg:ml-auto" : ""}`}
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
