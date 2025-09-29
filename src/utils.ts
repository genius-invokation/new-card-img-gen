import type { Accessor } from "solid-js";
import { TYPE_TAG_IMG_NAME_MAP } from "./constants";

export const ASSETS_API_ENDPOINT = import.meta.env.ASSETS_API_ENDPOINT || "https://assets.gi-tcg.guyutongxue.site/api/v3";

export const tagImageUrl = (tag: string) =>
  tag.startsWith("GCG_TAG_ELEMENT_")
    ? `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Buff_Common_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`
    : `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Tag_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`;
export const cardFaceUrl = (id: number, cardFace: string) =>
  `${ASSETS_API_ENDPOINT}/images/${id}?type=cardface`;
export const iconUrl = (id: number, icon: string) =>
  `${ASSETS_API_ENDPOINT}/images/${id}?type=icon`;

export const nar = <A, B extends A>(
  accessor: Accessor<A>,
  cond: (x: A) => x is B,
): B | null => {
  const value = accessor();
  return cond(value) ? value : null;
};
