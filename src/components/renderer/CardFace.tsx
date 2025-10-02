import type { JSX } from "solid-js";
import { useGlobalSettings } from "../../context";
import {
  CARD_BACK_FRAME,
  CARD_LEGEND_FRAME,
  CARD_NORMAL_FRAME,
} from "../../constants";
import { cardFaceUrl } from "../../utils";
import "./CardFace.css";

export const CardFace = (props: {
  class?: string; // Solid style
  id: number;
  isLegend?: boolean;
  cardFace: string;
  children?: JSX.Element;
}) => {
  const { cardbackImage } = useGlobalSettings();
  return (
    <div class={`card-face-component ${props.class ?? ""}`}>
      <img src={`${import.meta.env.BASE_URL}assets/cardbacks/${cardbackImage()}.png`} class="card-back" />
      <img src={CARD_BACK_FRAME} class="card-frame-shadow" />
      <div class="card-face">
        <img src={cardFaceUrl(props.id)} class="card-face-image" />
        <img
          src={props.isLegend ? CARD_LEGEND_FRAME : CARD_NORMAL_FRAME}
          class="card-frame"
        />
        {props.children}
      </div>
    </div>
  );
};
