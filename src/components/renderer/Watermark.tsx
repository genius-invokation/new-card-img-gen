import { Show, createMemo, createUniqueId } from "solid-js";
import "./Watermark.css";

interface WatermarkProps {
  text?: string;
}

export const Watermark = (props: WatermarkProps) => {
  const sanitized = createMemo(() => props.text?.trim());
  const patternId = createUniqueId();

  return (
    <Show when={sanitized()}>
      {(text) => (
        <svg class="watermark-svg" aria-hidden="true">
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="856"
              height="428"
            >
              <g transform="translate(428 214) rotate(-20)">
                <text
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-family="HYWH, sans-serif"
                  font-style="italic"
                  font-size="170"
                  fill="#716864"
                  fill-opacity="0.03"
                  letter-spacing="-1rem"
                >
                  {text()}
                </text>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      )}
    </Show>
  );
};

