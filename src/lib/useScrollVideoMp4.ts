"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseScrollVideoMp4Options = {
  src: string;
};

export function useScrollVideoMp4({ src }: UseScrollVideoMp4Options) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const markReady = () => {
      if (cancelled || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }
      durationRef.current = video.duration;
      video.pause();
      video.currentTime = 0;
      setIsReady(true);
    };

    const onError = () => {
      if (!cancelled) setLoadError(true);
    };

    setIsReady(false);
    setLoadError(false);
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("error", onError);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("error", onError);
    };
  }, [src]);

  const updateFrameFromProgress = useCallback(
    (progress: number) => {
      const video = videoRef.current;
      const duration = durationRef.current;
      if (!video || !duration || !isReady) return;

      const target = Math.max(0, Math.min(1, progress)) * duration;
      if (Math.abs(video.currentTime - target) > 0.03) {
        video.currentTime = target;
      }
    },
    [isReady],
  );

  return {
    videoRef,
    isReady,
    loadError,
    updateFrameFromProgress,
  };
}
