"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { boats } from "@/data/boats";
import { brand } from "@/data/brand";
import { animateSectionTypography } from "@/lib/section-motion";
import { useLanguage } from "@/i18n/LanguageProvider";
import { interpolate, type Translations } from "@/i18n/translations";

gsap.registerPlugin(ScrollTrigger);

type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  boatId: string;
  occasion: string;
  notes: string;
};

type BookingSectionProps = {
  selectedBoatId?: string;
  onBoatChange: (boatId: string) => void;
};

function buildWhatsAppMessage(
  form: BookingFormState,
  t: Translations,
) {
  const boat = boats.find((item) => item.id === form.boatId);
  const occasionLabel =
    t.booking.occasions.find((item) => item.value === form.occasion)?.label ??
    form.occasion;

  return [
    interpolate(t.booking.whatsappIntro, { brand: brand.name }),
    "",
    `${t.booking.whatsappFields.name}: ${form.name}`,
    `${t.booking.whatsappFields.email}: ${form.email}`,
    `${t.booking.whatsappFields.phone}: ${form.phone}`,
    `${t.booking.whatsappFields.date}: ${form.date}`,
    `${t.booking.whatsappFields.guests}: ${form.guests}`,
    `${t.booking.whatsappFields.boat}: ${boat?.name ?? t.booking.whatsappFields.tbd}`,
    `${t.booking.whatsappFields.occasion}: ${occasionLabel}`,
    form.notes
      ? `${t.booking.whatsappFields.notes}: ${form.notes}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function BookingSection({
  selectedBoatId,
  onBoatChange,
}: BookingSectionProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<BookingFormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "6",
    boatId: selectedBoatId ?? boats.find((boat) => boat.featured)?.id ?? boats[0].id,
    occasion: "day-charter",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const activeBoatId = selectedBoatId ?? form.boatId;

  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(
      buildWhatsAppMessage({ ...form, boatId: activeBoatId }, t),
    );
    return `${brand.whatsappHref}?text=${message}`;
  }, [form, activeBoatId, t]);

  const updateField = <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "boatId") {
      onBoatChange(String(value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  useGSAP(
    () => {
      const intro = introRef.current;
      if (!intro) return;
      animateSectionTypography(intro);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="book"
      className="relative site-section-shallows px-6 py-[var(--space-section)] lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div ref={introRef}>
          <p className="eyebrow mb-5" data-motion-eyebrow>
            {t.booking.eyebrow}
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">{t.booking.titleLine1}</span>
            </span>
            <span className="line-mask" data-motion-line>
              <span className="line-inner italic text-ocean-light">
                {t.booking.titleLine2}
              </span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            {t.booking.description}
          </p>

          <div className="mt-10 space-y-4 rounded-[1.25rem] border border-sea-glow/15 bg-ocean-mid/20 p-6 backdrop-blur-sm">
            <p className="text-sm text-cream-muted">{t.booking.preferTalk}</p>
            <div className="flex flex-wrap gap-3">
              <a href={brand.phoneHref} className="btn-secondary">
                {t.booking.call} {brand.phoneDisplay}
              </a>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {t.booking.whatsapp}
              </a>
            </div>
            <p className="space-y-2 text-xs leading-relaxed text-cream-muted">
              <span className="block font-medium text-cream">{t.booking.pickup}</span>
              <span className="block">{brand.address}</span>
              <a
                href={brand.phoneHref}
                className="block transition hover:text-cream"
              >
                {brand.phoneDisplay}
              </a>
              <a
                href={brand.emailHref}
                className="block transition hover:text-cream"
              >
                {brand.email}
              </a>
              <span className="block pt-1">
                {t.booking.hours}: {t.footer.hours}
              </span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.5rem] border border-sea-glow/15 bg-ocean-mid/25 p-6 backdrop-blur-md lg:p-8"
          data-lenis-prevent
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.fullName}</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder={t.booking.namePlaceholder}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.email}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder={t.booking.emailPlaceholder}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.phone}</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder={t.booking.phonePlaceholder}
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.preferredDate}</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.guests}</span>
              <select
                value={form.guests}
                onChange={(event) => updateField("guests", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              >
                {Array.from({ length: 13 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={String(count)}>
                      {count}{" "}
                      {count > 1
                        ? t.booking.guestPlural
                        : t.booking.guestSingular}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">{t.booking.occasion}</span>
              <select
                value={form.occasion}
                onChange={(event) =>
                  updateField("occasion", event.target.value)
                }
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              >
                {t.booking.occasions.map((occasion) => (
                  <option key={occasion.value} value={occasion.value}>
                    {occasion.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm">
            <span className="text-cream-muted">{t.booking.selectYacht}</span>
            <select
              value={activeBoatId}
              onChange={(event) => updateField("boatId", event.target.value)}
              className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
            >
              {boats.map((boat) => (
                <option key={boat.id} value={boat.id}>
                  {boat.name} — from ${boat.priceFrom}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 grid gap-2 text-sm">
            <span className="text-cream-muted">{t.booking.notes}</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={4}
              className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              placeholder={t.booking.notesPlaceholder}
            />
          </label>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="submit" className="btn-primary">
              {t.booking.submit}
            </button>
            <a href={brand.emailHref} className="btn-secondary">
              {t.booking.emailInstead}
            </a>
          </div>

          {submitted ? (
            <p className="mt-4 text-sm text-gold-soft">{t.booking.submitted}</p>
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-cream-muted">
              {t.booking.disclaimer}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
