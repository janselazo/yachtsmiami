"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  animateExperienceCards,
  animateSectionTypography,
} from "@/lib/section-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const isSectionVisible = () => {
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const tryPlay = () => {
      if (!isSectionVisible()) return;

      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          /* Autoplay may be blocked until user interaction */
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
              tryPlay();
            } else {
              video.addEventListener("canplay", tryPlay, { once: true });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    const onCanPlay = () => {
      if (isSectionVisible()) tryPlay();
    };

    const onInteraction = () => {
      if (isSectionVisible() && video.paused) tryPlay();
    };

    video.addEventListener("canplay", onCanPlay);
    window.addEventListener("touchstart", onInteraction, {
      passive: true,
    });
    window.addEventListener("click", onInteraction);

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", onCanPlay);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("click", onInteraction);
    };
  }, []);

  useGSAP(
    () => {
      const intro = introRef.current;
      const list = listRef.current;
      if (!intro || !list) return;

      animateSectionTypography(intro);

      const cards = list.querySelectorAll<HTMLElement>("[data-experience]");
      animateExperienceCards(list, cards);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="relative overflow-hidden px-6 py-[var(--space-section)] lg:px-10"
    >
      <div className="absolute inset-0">
        <div className="experience-video-media">
          <video
            ref={videoRef}
            src="/video/dolphin.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="experience-video-bg"
            aria-hidden="true"
          />
        </div>
        <div className="scene-overlay absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div ref={introRef}>
          <p className="eyebrow mb-5" data-motion-eyebrow>
            {t.experiences.eyebrow}
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">{t.experiences.titleLine1}</span>
            </span>
            <span className="line-mask" data-motion-line>
              <span className="line-inner italic text-gold-soft">
                {t.experiences.titleLine2}
              </span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            {t.experiences.description}
          </p>
        </div>

        <div ref={listRef} className="grid gap-4">
          {t.experiences.items.map((experience, index) => (
            <article
              key={experience.title}
              data-experience
              className="rounded-[1rem] border border-sea-glow/15 bg-ocean-mid/25 p-6 backdrop-blur-sm"
            >
              <p
                className="text-[0.65rem] uppercase tracking-[0.24em] text-gold-soft"
                data-motion-card-label
              >
                0{index + 1}
              </p>
              <h3
                className="mt-3 font-display text-3xl font-black text-cream"
                data-motion-card-title
              >
                {experience.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed text-cream-muted"
                data-motion-card-copy
              >
                {experience.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
