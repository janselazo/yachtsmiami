"use client";

import { useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReadyContext } from "@/lib/scroll-context";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [scrollReady, setScrollReady] = useState(false);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      requestAnimationFrame(() => {
        setScrollReady(true);
        ScrollTrigger.refresh(true);
      });
      return;
    }

    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 1.05,
      autoRaf: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh(true);
    };

    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      lenis.resize();
      setScrollReady(true);
      ScrollTrigger.refresh(true);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.refresh(true);
      setScrollReady(false);
    };
  }, []);

  return (
    <ScrollReadyContext.Provider value={scrollReady}>
      {children}
    </ScrollReadyContext.Provider>
  );
}
