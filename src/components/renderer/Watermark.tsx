import { Show, createMemo } from "solid-js";
import "./Watermark.css";

const escapeSvgText = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

interface WatermarkProps {
  text?: string;
}

export const Watermark = (props: WatermarkProps) => {
  const backgroundImage = createMemo(() => {
    const raw = props.text?.trim();
    if (!raw) return undefined;
    const escaped = escapeSvgText(raw);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><g transform="translate(180 100) rotate(-30)"><text text-anchor="middle" dominant-baseline="middle" font-family="HYWH, sans-serif" font-size="32" fill="rgba(0,0,0,0.03)">${escaped}</text></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });

  return (
    <Show when={backgroundImage()}>
      {(bg) => <div class="watermark" style={{ "background-image": bg() }} />}
    </Show>
  );
};

