import type { Accessor } from "solid-js";
import { ASSETS_API_ENDPOINT, TYPE_TAG_IMG_NAME_MAP } from "./constants";
import type { AllUnionFields } from "type-fest";
import type { ParsedChild } from "./types";

export const tagImageUrl = (tag: string) =>
  tag.startsWith("GCG_TAG_ELEMENT_")
    ? `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Buff_Common_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`
    : `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Tag_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`;
export const cardFaceUrl = (id: number) =>
  `${ASSETS_API_ENDPOINT}/image/${id}?type=cardFace`;
export const iconUrl = (id: number) =>
  `${ASSETS_API_ENDPOINT}/image/${id}?type=icon`;

export type AnyChild = AllUnionFields<ParsedChild>;
export const entityIconUrl = (item: AnyChild) => {
  return (
    item.buffIconUrl ||
    item.iconUrl ||
    (["GCG_RULE_EXPLANATION", "GCG_CARD_EVENT"].includes(item.type)
      ? tagImageUrl(item.type)
      : iconUrl(item.id))
  );
};

export const nar = <A, B extends A>(
  accessor: Accessor<A>,
  cond: (x: A) => x is B,
): B | null => {
  const value = accessor();
  return cond(value) ? value : null;
};
