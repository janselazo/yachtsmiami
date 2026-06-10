"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "@/data/brand";
import { animateSectionTypography } from "@/lib/section-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export function JetSkiSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(t.jetSki.whatsappMessage);
    return `${brand.whatsappHref}?text=${message}`;
  }, [t.jetSki.whatsappMessage]);

  useGSAP(
    () => {
      const intro = introRef.current;
      const card = cardRef.current;
      if (!intro) return;

      animateSectionTypography(intro);

      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="jet-ski"
      className="relative site-section-water px-6 py-[var(--space-section)] lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div ref={introRef}>
          <p className="eyebrow mb-5" data-motion-eyebrow>
            {t.jetSki.eyebrow}
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">{t.jetSki.title}</span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            {t.jetSki.description}
          </p>
        </div>

        <div
          ref={cardRef}
          className="rounded-[1.5rem] border border-sea-glow/20 bg-ocean-mid/25 p-8 backdrop-blur-sm lg:p-10"
        >
          <span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">
            {t.jetSki.offerBadge}
          </span>

          <p className="mt-6 text-lg leading-relaxed text-cream">{t.jetSki.promo}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="#book" className="btn-primary">
              {t.jetSki.cta}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t.jetSki.whatsappCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
