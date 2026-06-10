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

function scheduleRenderRetries(tryRender: () => boolean) {
  let cancelled = false;
  let frameRetries = 0;

  const retryOnFrame = () => {
    if (cancelled || frameRetries > 120) return;
    if (!tryRender()) {
      frameRetries += 1;
      requestAnimationFrame(retryOnFrame);
    }
  };

  requestAnimationFrame(retryOnFrame);

  const timeouts = [100, 250, 500, 1000, 2000].map((delay) =>
    window.setTimeout(() => {
      if (!cancelled) {
        tryRender();
        ScrollTrigger.refresh();
      }
    }, delay),
  );

  return () => {
    cancelled = true;
    timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  };
}

export function useScrollVideoFrames({
  sequence,
  pinRef,
  canvasRef,
}: UseScrollVideoFramesOptions) {
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: sequence.count }, () => null),
  );
  const frameIndexRef = useRef(0);
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
      }
      return didRender;
    },
    [canvasRef, pinRef],
  );

  const tryRenderCurrentFrame = useCallback(() => {
    return renderFrame(frameIndexRef.current);
  }, [renderFrame]);

  const registerPosterImage = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image?.complete || !image.naturalWidth) {
        return false;
      }

      framesRef.current[0] = image;
      requestAnimationFrame(() => {
        tryRenderCurrentFrame();
        ScrollTrigger.refresh();
      });
      return true;
    },
    [tryRenderCurrentFrame],
  );

  const onPosterLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      registerPosterImage(event.currentTarget);
    },
    [registerPosterImage],
  );

  useEffect(() => {
    let cancelled = false;
    let cancelRenderRetries = () => {};

    const preloadFrames = async () => {
      try {
        if (!framesRef.current[0]) {
          const first = await loadFrameImage(getFramePath(sequence, 0), "high");
          if (cancelled) return;
          framesRef.current[0] = first;
        }

        cancelRenderRetries = scheduleRenderRetries(tryRenderCurrentFrame);

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
      cancelRenderRetries();
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
    loadError,
    onPosterLoad,
    renderFrame,
    updateFrameFromProgress,
  };
}
