"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    scrollTriggerIdRef.current = scrollTriggerId;
  }, [onReady, scrollTriggerId]);

  const updateFrameFromProgress = useCallback((progress: number) => {
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !isReadyRef.current || !duration) return;

    const target = Math.max(0, Math.min(1, progress)) * duration;
    if (Math.abs(video.currentTime - target) > 0.001) {
      seekVideo(video, target);
    }
  }, []);

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
      video.pause();
      seekVideo(video, 0);
      setIsReady(true);
      syncToScroll();
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
      onReadyRef.current?.();
    };

    const onError = () => {
      if (!cancelled) setLoadError(true);
    };

    isReadyRef.current = false;
    durationRef.current = 0;
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
