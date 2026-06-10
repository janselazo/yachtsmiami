"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getFramePath,
  loadFrameImage,
  renderFrameToCanvas,
  type FrameSequence,
} from "@/lib/scroll-video-canvas";

gsap.registerPlugin(ScrollTrigger);

type UseScrollVideoFramesOptions = {
  sequence: FrameSequence;
  pinRef: React.RefObject<HTMLElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function useScrollVideoFrames({
  sequence,
  pinRef,
  canvasRef,
}: UseScrollVideoFramesOptions) {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: sequence.count }, () => null),
  );
  const frameIndexRef = useRef(0);
  const [posterVisible, setPosterVisible] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const pin = pinRef.current;
      const image = framesRef.current[index];

      if (!canvas || !pin || !image) {
        return false;
      }

      const didRender = renderFrameToCanvas(canvas, pin, image);
      if (didRender) {
        frameIndexRef.current = index;
        setPosterVisible(false);
      }
      return didRender;
    },
    [canvasRef, pinRef],
  );

  const tryRenderCurrentFrame = useCallback(() => {
    renderFrame(frameIndexRef.current);
  }, [renderFrame]);

  useEffect(() => {
    let cancelled = false;

    const preloadFrames = async () => {
      try {
        const first = await loadFrameImage(getFramePath(sequence, 0), "high");
        if (cancelled) return;

        framesRef.current[0] = first;
        requestAnimationFrame(() => {
          tryRenderCurrentFrame();
          ScrollTrigger.refresh();
        });

        // Pin can be 0×0 on first paint; retry until canvas draws.
        let retries = 0;
        const retryRender = () => {
          if (cancelled || retries > 24) return;
          if (!tryRenderCurrentFrame()) {
            retries += 1;
            requestAnimationFrame(retryRender);
          }
        };
        requestAnimationFrame(retryRender);

        const batchSize = 12;
        for (let start = 1; start < sequence.count; start += batchSize) {
          if (cancelled) return;

          const end = Math.min(start + batchSize, sequence.count);
          const batch = await Promise.allSettled(
            Array.from({ length: end - start }, (_, offset) => {
              const index = start + offset;
              return loadFrameImage(getFramePath(sequence, index));
            }),
          );

          batch.forEach((result, offset) => {
            if (result.status === "fulfilled") {
              framesRef.current[start + offset] = result.value;
            }
          });
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    };

    preloadFrames();

    return () => {
      cancelled = true;
    };
  }, [sequence, tryRenderCurrentFrame]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const observer = new ResizeObserver(() => {
      tryRenderCurrentFrame();
    });

    observer.observe(pin);
    window.addEventListener("resize", tryRenderCurrentFrame);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", tryRenderCurrentFrame);
    };
  }, [pinRef, tryRenderCurrentFrame]);

  const updateFrameFromProgress = useCallback(
    (progress: number) => {
      const nextIndex = Math.round(progress * (sequence.count - 1));
      if (framesRef.current[nextIndex]) {
        renderFrame(nextIndex);
      }
    },
    [renderFrame, sequence.count],
  );

  return {
    posterSrc: getFramePath(sequence, 0),
    posterVisible,
    loadError,
    renderFrame,
    updateFrameFromProgress,
  };
}
