import type { FrameSequence } from "@/lib/scroll-video-canvas";

export const homepageVideoSequence = {
  src: "/video/f3.mp4",
  scrollMultiplier: 8,
} as const;

export const pinkYachtVideoSequence = {
  src: "/video/p2.mp4",
  scrollMultiplier: 4.5,
} as const;

/** @deprecated Scroll frames replaced by MP4 scrub on Cloudflare Pages */
export const homepageFrameSequence = {
  source: "F3.mp4",
  basePath: "/video/f3-frames/frame_",
  extension: ".jpg",
  padLength: 4,
  count: 304,
  fps: 30,
  scrollMultiplier: 8,
} as const;

/** @deprecated Scroll frames replaced by MP4 scrub on Cloudflare Pages */
export const pinkYachtFrameSequence = {
  source: "P2.mp4",
  basePath: "/video/p2-frames/frame_",
  extension: ".jpg",
  padLength: 4,
  count: 151,
  fps: 30,
  scrollMultiplier: 4.5,
} as const;

/** @deprecated Use homepageFrameSequence */
export const heroFrameSequence = homepageFrameSequence;

/** @deprecated Second-section video removed */
export const signatureSceneFrameSequence = homepageFrameSequence;

export function getHomepageFramePath(index: number): string {
  return getFramePath(homepageFrameSequence, index);
}

export function getHeroFramePath(index: number): string {
  return getHomepageFramePath(index);
}

export function getPinkYachtFramePath(index: number): string {
  return getFramePath(pinkYachtFrameSequence, index);
}

export function getSignatureSceneFramePath(index: number): string {
  return getHomepageFramePath(index);
}

function getFramePath(sequence: FrameSequence, index: number): string {
  const frameNumber =
    Math.min(Math.max(index, 0), sequence.count - 1) + 1;

  return `${sequence.basePath}${String(frameNumber).padStart(sequence.padLength, "0")}${sequence.extension}`;
}
