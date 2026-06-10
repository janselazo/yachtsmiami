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
        ScrollTrigger.refresh();
      });
      return;
    }

    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 1.05,
    });

    const root = document.documentElement;

    ScrollTrigger.defaults({
      scroller: root,
    });

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: root.style.transform ? "transform" : "fixed",
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onRefresh = () => {
      lenis.resize();
    };

    ScrollTrigger.addEventListener("refresh", onRefresh);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => {
      setScrollReady(true);
      ScrollTrigger.refresh();
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(root, {});
      ScrollTrigger.defaults({ scroller: undefined });
      ScrollTrigger.clearScrollMemory();
      setScrollReady(false);
    };
  }, []);

  return (
    <ScrollReadyContext.Provider value={scrollReady}>
      {children}
    </ScrollReadyContext.Provider>
  );
}
