import type { Verse } from "./verses";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Renders verse + background to a 1080x1350 PNG and triggers a download. */
export async function shareVerseImage(verse: Verse, imageSrc: string, downloadOnly = false) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = await loadImage(imageSrc);
  const scale = Math.max(W / img.width, H / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);

  const scrim = ctx.createLinearGradient(0, 0, 0, H);
  scrim.addColorStop(0, "rgba(18,22,24,0.25)");
  scrim.addColorStop(0.45, "rgba(18,22,24,0.45)");
  scrim.addColorStop(1, "rgba(12,16,18,0.8)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, W, H);

  const margin = 110;
  const maxWidth = W - margin * 2;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.96)";

  let fontSize = 58;
  let lines: string[] = [];
  do {
    ctx.font = `400 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    lines = wrap(ctx, verse.text, maxWidth);
    fontSize -= 2;
  } while (lines.length * (fontSize * 1.35) > H * 0.55 && fontSize > 26);

  const lineHeight = fontSize * 1.4;
  const blockHeight = lines.length * lineHeight;
  let y = H / 2 - blockHeight / 2 + lineHeight * 0.5;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += lineHeight;
  }

  ctx.font = '500 26px Inter, system-ui, sans-serif';
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.fillText(verse.reference.toUpperCase() + "  ·  KJV", W / 2, y + 56);

  ctx.font = '400 20px Inter, system-ui, sans-serif';
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("Still Waters", W / 2, H - 70);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const file = new File([blob], `${verse.reference.replace(/[^\w]+/g, "-")}.png`, {
    type: "image/png",
  });

  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (!downloadOnly && nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: verse.reference });
      return;
    } catch {
      /* fall through to download */
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}

export const downloadVerseImage = (verse: Verse, imageSrc: string) => shareVerseImage(verse, imageSrc, true);
