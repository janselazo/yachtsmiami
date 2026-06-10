import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionMotionOptions = {
  align?: "left" | "right";
  parallax?: boolean;
  parallaxTrigger?: HTMLElement;
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateSectionTypography(
  container: HTMLElement,
  options: SectionMotionOptions = {},
) {
  const { align = "left", parallax = false, parallaxTrigger } = options;

  const eyebrow = container.querySelector<HTMLElement>("[data-motion-eyebrow]");
  const lines = container.querySelectorAll<HTMLElement>(
    "[data-motion-line] .line-inner",
  );
  const accent = container.querySelector<HTMLElement>("[data-motion-accent]");
  const copy = container.querySelector<HTMLElement>("[data-motion-copy]");

  if (prefersReducedMotion()) {
    gsap.set([eyebrow, ...lines, accent, copy].filter(Boolean), {
      clearProps: "all",
    });
    if (accent) gsap.set(accent, { scaleX: 1 });
    return;
  }

  const origin = align === "right" ? "right center" : "left center";
  const slideFromX = align === "right" ? 28 : -28;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  if (eyebrow) {
    gsap.set(eyebrow, { opacity: 0, x: slideFromX * 0.4, letterSpacing: "0.42em" });
    timeline.to(
      eyebrow,
      {
        opacity: 1,
        x: 0,
        letterSpacing: "0.28em",
        duration: 0.7,
        ease: "power3.out",
      },
      0,
    );
  }

  if (lines.length) {
    gsap.set(lines, { yPercent: 110 });
    timeline.to(
      lines,
      {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.11,
        ease: "power3.out",
      },
      0.06,
    );
  }

  if (accent) {
    gsap.set(accent, { scaleX: 0, transformOrigin: origin });
    timeline.to(
      accent,
      { scaleX: 1, duration: 0.55, ease: "power2.out" },
      0.24,
    );
  }

  if (copy) {
    gsap.set(copy, { opacity: 0, y: 28, x: slideFromX * 0.25 });
    timeline.to(
      copy,
      { opacity: 1, y: 0, x: 0, duration: 0.75, ease: "power3.out" },
      0.34,
    );
  }

  if (parallax) {
    const trigger = parallaxTrigger ?? container;
    gsap.to(container, {
      y: -36,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

export function animateExperienceCards(
  container: HTMLElement,
  cards: NodeListOf<HTMLElement>,
) {
  if (prefersReducedMotion() || !cards.length) return;

  cards.forEach((card, index) => {
    const title = card.querySelector<HTMLElement>("[data-motion-card-title]");
    const copy = card.querySelector<HTMLElement>("[data-motion-card-copy]");
    const label = card.querySelector<HTMLElement>("[data-motion-card-label]");

    gsap.set(card, { opacity: 0, y: 40 });
    if (label) gsap.set(label, { opacity: 0, x: -16 });
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (copy) gsap.set(copy, { opacity: 0, y: 16 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      delay: index * 0.04,
    });

    timeline.to(card, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);

    if (label) {
      timeline.to(
        label,
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        0.08,
      );
    }

    if (title) {
      timeline.to(
        title,
        { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
        0.14,
      );
    }

    if (copy) {
      timeline.to(
        copy,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.24,
      );
    }
  });
}
