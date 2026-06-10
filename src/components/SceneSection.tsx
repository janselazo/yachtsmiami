"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateSectionTypography, prefersReducedMotion } from "@/lib/section-motion";

gsap.registerPlugin(ScrollTrigger);

type SceneSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  titleAccentClassName?: string;
  description: string;
  image: string;
  imageAlt: string;
  align?: "left" | "right";
  overlay?: "default" | "light";
  imageQuality?: number;
};

export function SceneSection({
  id,
  eyebrow,
  title,
  titleAccent,
  titleAccentClassName = "italic text-pink-soft",
  description,
  image,
  imageAlt,
  align = "left",
  overlay = "default",
  imageQuality = 92,
}: SceneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const media = mediaRef.current;
      const intro = introRef.current;
      if (!section || !media || !intro) return;

      if (prefersReducedMotion()) {
        gsap.set(media, { scale: 1 });
        return;
      }

      gsap.fromTo(
        media,
        { scale: 1.08 },
        {
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      animateSectionTypography(intro, {
        align,
        parallax: true,
        parallaxTrigger: section,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          quality={imageQuality}
          className="scene-media-image object-cover"
        />
        <div
          className={`absolute inset-0 ${
            overlay === "light" ? "scene-overlay-light" : "scene-overlay"
          }`}
        />
      </div>

      <div
        className={`relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-6 pb-24 pt-32 lg:px-10 lg:pb-28 ${
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
    </section>
  );
}
