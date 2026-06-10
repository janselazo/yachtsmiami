export const homepageVideoScroll = {
  scrollMultiplier: 8,
  /** Hero UI fades out just before the video midpoint */
  heroContentOutStart: 0.44,
  /** Signature copy animates in at the video midpoint */
  sceneContentInStart: 0.5,
} as const;

/** @deprecated Use homepageVideoScroll */
export const combinedVideoScroll = homepageVideoScroll;
