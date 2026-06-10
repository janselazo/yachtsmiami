export const homepageVideoScroll = {
  scrollMultiplier: 8,
  /** Hero UI fades out just before the video midpoint */
  heroContentOutStart: 0.44,
  /** Signature copy animates in at the video midpoint */
  sceneContentInStart: 0.5,
  /** Keep hero title/subtitle hidden this many seconds before scene copy appears */
  heroCopyLeadSeconds: 1,
} as const;

/** Map video seconds to scrub timeline progress (0–1) */
export function videoSecondsToScrollProgress(
  seconds: number,
  frameCount: number,
  fps: number,
): number {
  return (seconds * fps) / Math.max(frameCount - 1, 1);
}

/** @deprecated Use homepageVideoScroll */
export const combinedVideoScroll = homepageVideoScroll;
