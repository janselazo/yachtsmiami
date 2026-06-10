"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SCRUB_FPS = 30;
const MIN_SEEK_DELTA = 1 / SCRUB_FPS;

type UseScrollVideoMp4Options = {
  src: string;
  scrollTriggerId?: string;
  preload?: "auto" | "metadata" | "none";
  onReady?: () => void;
};

function seekVideo(video: HTMLVideoElement, time: number) {
  const clamped = Math.max(0, Math.min(time, video.duration || time));

  if (typeof video.fastSeek === "function") {
    try {
      video.fastSeek(clamped);
      return;
    } catch {
      // fall through to currentTime
    }
  }

  video.currentTime = clamped;
}

function progressToTime(progress: number, duration: number) {
  const frame = Math.round(Math.max(0, Math.min(1, progress)) * duration * SCRUB_FPS);
  return frame / SCRUB_FPS;
}

export function useScrollVideoMp4({
  src,
  scrollTriggerId,
  preload = "auto",
  onReady,
}: UseScrollVideoMp4Options) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const isReadyRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const scrollTriggerIdRef = useRef(scrollTriggerId);
  const pendingProgressRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTargetRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    scrollTriggerIdRef.current = scrollTriggerId;
  }, [onReady, scrollTriggerId]);

  const applyProgress = useCallback((progress: number) => {
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !isReadyRef.current || !duration) return;

    const target = progressToTime(progress, duration);
    if (
      lastTargetRef.current !== null &&
      Math.abs(lastTargetRef.current - target) < MIN_SEEK_DELTA
    ) {
      return;
    }

    lastTargetRef.current = target;
    seekVideo(video, target);
  }, []);

  const updateFrameFromProgress = useCallback(
    (progress: number) => {
      pendingProgressRef.current = progress;
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingProgressRef.current === null) return;
        applyProgress(pendingProgressRef.current);
        pendingProgressRef.current = null;
      });
    },
    [applyProgress],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const syncToScroll = () => {
      const triggerId = scrollTriggerIdRef.current;
      if (!triggerId) return;
      const trigger = ScrollTrigger.getById(triggerId);
      updateFrameFromProgress(trigger?.progress ?? 0);
    };

    const markReady = () => {
      if (cancelled || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      durationRef.current = video.duration;
      isReadyRef.current = true;
      lastTargetRef.current = null;
      video.pause();
      seekVideo(video, 0);
      setIsReady(true);
      syncToScroll();
      onReadyRef.current?.();
    };

    const onError = () => {
      if (!cancelled) setLoadError(true);
    };

    isReadyRef.current = false;
    durationRef.current = 0;
    lastTargetRef.current = null;
    setIsReady(false);
    setLoadError(false);
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.preload = preload;
    video.load();

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("error", onError);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("error", onError);
    };
  }, [src, preload, updateFrameFromProgress]);

  return {
    videoRef,
    isReady,
    loadError,
    updateFrameFromProgress,
  };
}
