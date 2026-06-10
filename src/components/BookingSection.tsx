"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { boats } from "@/data/boats";
import { brand } from "@/data/brand";
import { animateSectionTypography } from "@/lib/section-motion";

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

const initialFormState: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  guests: "6",
  boatId: boats.find((boat) => boat.featured)?.id ?? boats[0].id,
  occasion: "Day charter",
  notes: "",
};

type BookingSectionProps = {
  selectedBoatId?: string;
  onBoatChange: (boatId: string) => void;
};

function buildWhatsAppMessage(form: BookingFormState) {
  const boat = boats.find((item) => item.id === form.boatId);
  return [
    "Hi Blue Paradise Yachts — I'd like to book a charter.",
    "",
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Date: ${form.date}`,
    `Guests: ${form.guests}`,
    `Boat: ${boat?.name ?? "TBD"}`,
    `Occasion: ${form.occasion}`,
    form.notes ? `Notes: ${form.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function BookingSection({
  selectedBoatId,
  onBoatChange,
}: BookingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<BookingFormState>({
    ...initialFormState,
    boatId: selectedBoatId ?? initialFormState.boatId,
  });
  const [submitted, setSubmitted] = useState(false);

  const activeBoatId = selectedBoatId ?? form.boatId;

  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(
      buildWhatsAppMessage({ ...form, boatId: activeBoatId }),
    );
    return `${brand.whatsappHref}?text=${message}`;
  }, [form, activeBoatId]);

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
            Book Your Trip
          </p>
          <h2 className="display-headline text-cream">
            <span className="line-mask" data-motion-line>
              <span className="line-inner">Reserve your</span>
            </span>
            <span className="line-mask" data-motion-line>
              <span className="line-inner italic text-ocean-light">day at sea</span>
            </span>
          </h2>
          <span className="section-accent" data-motion-accent aria-hidden="true" />
          <p className="section-copy" data-motion-copy>
            Tell us your date, group size, and vibe. We will confirm
            availability and walk you through the deposit — no guesswork, just
            premium service.
          </p>

          <div className="mt-10 space-y-4 rounded-[1.25rem] border border-sea-glow/15 bg-ocean-mid/20 p-6 backdrop-blur-sm">
            <p className="text-sm text-cream-muted">Prefer to talk now?</p>
            <div className="flex flex-wrap gap-3">
              <a href={brand.phoneHref} className="btn-secondary">
                Call {brand.phone}
              </a>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-xs leading-relaxed text-cream-muted">
              Pickup: {brand.address}
              <br />
              Hours: {brand.hours}
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
              <span className="text-cream-muted">Full name</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder="you@email.com"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">Phone</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                placeholder="(305) 555-0100"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">Preferred date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">Guests</span>
              <select
                value={form.guests}
                onChange={(event) => updateField("guests", event.target.value)}
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              >
                {Array.from({ length: 13 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={String(count)}>
                      {count} guest{count > 1 ? "s" : ""}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-cream-muted">Occasion</span>
              <select
                value={form.occasion}
                onChange={(event) =>
                  updateField("occasion", event.target.value)
                }
                className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              >
                <option>Day charter</option>
                <option>Sunset cruise</option>
                <option>Bachelorette / birthday</option>
                <option>Corporate / VIP</option>
                <option>Sandbar day</option>
              </select>
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm">
            <span className="text-cream-muted">Select a yacht</span>
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
            <span className="text-cream-muted">Anything else we should know?</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={4}
              className="rounded-xl border border-white/10 bg-ocean-deep/60 px-4 py-3 text-cream outline-none transition focus:border-gold/50"
              placeholder="DJ, decorations, route preferences, etc."
            />
          </label>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="submit" className="btn-primary">
              Send booking request
            </button>
            <a href={brand.emailHref} className="btn-secondary">
              Email instead
            </a>
          </div>

          {submitted ? (
            <p className="mt-4 text-sm text-gold-soft">
              Your request opened in WhatsApp. We will confirm availability and
              next steps shortly.
            </p>
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-cream-muted">
              Submitting opens WhatsApp with your details pre-filled. Gratuity
              and premium add-ons are quoted separately.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
