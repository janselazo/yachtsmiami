"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { boats, type Boat } from "@/data/boats";
import { animateSectionTypography, prefersReducedMotion } from "@/lib/section-motion";
import { useLanguage } from "@/i18n/LanguageProvider";
import { interpolate } from "@/i18n/translations";

gsap.registerPlugin(ScrollTrigger);

type FleetSectionProps = {
  onSelectBoat: (boatId: string) => void;
  selectedBoatId?: string;
};

function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function BoatCard({
  boat,
  selected,
  onSelect,
}: {
  boat: Boat;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { locale, t } = useLanguage();
  const copy = t.boats[boat.id];

  return (
    <article
      className={`group overflow-hidden rounded-[1.25rem] border transition-all duration-300 ${
        selected
          ? "border-sea-glow/50 bg-ocean-mid/30 shadow-[0_20px_60px_rgba(34,163,214,0.18)]"
          : "border-sea-glow/10 bg-ocean-mid/15 hover:border-sea-glow/25"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={boat.image}
          alt={boat.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/20 to-transparent" />
        {boat.featured ? (
          <span className="absolute left-4 top-4 rounded-full border border-pink/40 bg-pink/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-pink-soft">
            {t.fleet.signature}
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-display text-2xl font-black text-cream">{boat.name}</p>
          <p className="mt-1 text-sm text-cream-muted">
            {boat.length} · {interpolate(t.fleet.guests, { count: boat.capacity })}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 lg:p-6">
        <p className="text-sm leading-relaxed text-cream-muted">
          {copy?.highlight ?? boat.highlight}
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold-soft">
              {t.fleet.from}
            </p>
            <p className="font-display text-3xl font-black text-cream">
              {formatPrice(boat.priceFrom, locale)}
            </p>
            <p className="text-xs text-cream-muted">
              /{copy?.duration ?? boat.duration}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(boat.id)}
            className={selected ? "btn-primary" : "btn-secondary"}
          >
            {selected ? t.fleet.selected : t.fleet.select}
          </button>
        </div>
      </div>
    </article>
  );
}

export function FleetSection({
  onSelectBoat,
  selectedBoatId,
}: FleetSectionProps) {
  const { locale, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const intro = introRef.current;
      const grid = gridRef.current;
      if (!intro || !grid) return;

      animateSectionTypography(intro);

      if (prefersReducedMotion()) return;

      const cards = grid.querySelectorAll<HTMLElement>("[data-boat-card]");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative site-section-water px-6 py-[var(--space-section)] lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div ref={introRef} className="max-w-3xl">
          <p className="eyebrow mb-5" data-motion-eyebrow>
            {t.fleet.eyebrow}
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">{t.fleet.titleLine1}</span>
            </span>
            <span className="line-mask" data-motion-line>
              <span className="line-inner italic text-ocean-light">
                {t.fleet.titleLine2}
              </span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            {t.fleet.description}
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {boats.map((boat) => (
            <div key={boat.id} data-boat-card>
              <BoatCard
                boat={boat}
                selected={selectedBoatId === boat.id}
                onSelect={onSelectBoat}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
