import type { JSX } from "solid-js";
import { useAppContext } from "../context/appContext";
import {
  CARD_BACK_FRAME,
  CARD_LEGEND_FRAME,
  CARD_NORMAL_FRAME,
} from "../constants/maps";

const cardFaceUrl = (cardFace: string) => `images/${cardFace}.png`;

export const CardFace = (props: {
  class?: string; // Solid style
  className?: string; // backward compatibility
  isLegend?: boolean;
  cardFace: string;
  children?: JSX.Element;
}) => {
  const { cardbackImage = "UI_Gcg_CardBack_Fonta_03" } = useAppContext();
  const mergedClass = () => props.class ?? props.className ?? "";
  return (
    <div class={`card-face-component ${mergedClass()}`}>
      <img src={`/assets/${cardbackImage}.png`} class="card-back" />
      <img src={CARD_BACK_FRAME} class="card-frame-shadow" />
      <div class="card-face">
        <img src={cardFaceUrl(props.cardFace)} class="card-face-image" />
        <img
          src={props.isLegend ? CARD_LEGEND_FRAME : CARD_NORMAL_FRAME}
          class="card-frame"
        />
        {props.children}
      </div>
    </div>
  );
};
