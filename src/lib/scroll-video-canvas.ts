export function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    drawWidth = image.width * (height / image.height);
    offsetX = (width - drawWidth) / 2;
  } else {
    drawHeight = image.height * (width / image.width);
    offsetY = (height - drawHeight) / 2;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

export function loadFrameImage(src: string, priority: "high" | "low" = "low") {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    if (priority === "high" && "fetchPriority" in image) {
      try {
        image.fetchPriority = "high";
      } catch {
        // Some embedded browsers reject fetchPriority on Image().
      }
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
    image.src = src;
  });
}

export type FrameSequence = {
  basePath: string;
  extension: string;
  padLength: number;
  count: number;
};

export function getFramePath(sequence: FrameSequence, index: number): string {
  const frameNumber =
    Math.min(Math.max(index, 0), sequence.count - 1) + 1;

  return `${sequence.basePath}${String(frameNumber).padStart(sequence.padLength, "0")}${sequence.extension}`;
}

export function renderFrameToCanvas(
  canvas: HTMLCanvasElement,
  pin: HTMLElement,
  image: HTMLImageElement,
) {
  const context = canvas.getContext("2d");

  if (
    !context ||
    !image.complete ||
    !image.naturalWidth ||
    pin.clientWidth === 0 ||
    pin.clientHeight === 0
  ) {
    return false;
  }

  const width = pin.clientWidth;
  const height = pin.clientHeight;
  const dpr = getCanvasDpr();

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, width, height);
  drawCover(context, image, width, height);
  return true;
}

export function getCanvasDpr() {
  return Math.min(window.devicePixelRatio || 1, 2.5);
}
