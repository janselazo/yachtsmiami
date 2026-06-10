"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/data/brand";
import {
  animateExperienceCards,
  animateSectionTypography,
} from "@/lib/section-motion";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        /* Autoplay may be blocked until user interaction */
      });
    }
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
            Experiences
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">More than a ride.</span>
            </span>
            <span className="line-mask" data-motion-line>
              <span className="line-inner italic text-gold-soft">
                A private escape.
              </span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            Whether you are chasing the sandbar, planning a bachelorette, or
            hosting clients on the bay — we tailor every charter to your vibe.
          </p>
        </div>

        <div ref={listRef} className="grid gap-4">
          {experiences.map((experience, index) => (
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
