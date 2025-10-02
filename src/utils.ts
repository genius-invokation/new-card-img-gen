import type { Accessor } from "solid-js";
import { ASSETS_API_ENDPOINT, TYPE_TAG_IMG_NAME_MAP } from "./constants";
import type { AllUnionFields } from "type-fest";
import type {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  ParsedChild,
  SkillRawData,
} from "./types";

export const tagImageUrl = (tag: string) =>
  tag.startsWith("GCG_TAG_ELEMENT_")
    ? `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Buff_Common_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`
    : `${import.meta.env.BASE_URL}assets/tags/UI_Gcg_Tag_${
        TYPE_TAG_IMG_NAME_MAP[tag]
      }.png`;
export const assetsImageUrl = (imageName: string) =>
  `${ASSETS_API_ENDPOINT}/image/raw/${imageName}`;

export type AnyChild = AllUnionFields<ParsedChild>;

type AnyRawChild =
  | CharacterRawData
  | SkillRawData
  | EntityRawData
  | ActionCardRawData
  | KeywordRawData;
export const iconUrl = (itemArg: AnyRawChild | AllUnionFields<AnyRawChild>) => {
  const item = itemArg as AllUnionFields<AnyRawChild>;
  return (
    item.buffIconUrl ||
    item.iconUrl ||
    (item.buffIcon
      ? assetsImageUrl(item.buffIcon)
      : item.icon
      ? assetsImageUrl(item.icon)
      : item.type
      ? tagImageUrl(item.type)
      : `https://placehold.co/128x128?text=${encodeURIComponent(item.name)}`)
  );
};

export const cardFaceUrl = (
  itemArg: AnyRawChild | AllUnionFields<AnyRawChild>,
) => {
  const item = itemArg as AllUnionFields<AnyRawChild>;
  return (
    item.cardFaceUrl ||
    (item.cardFace
      ? assetsImageUrl(item.cardFace)
      : `https://placehold.co/420x720?text=${encodeURIComponent(item.name)}`)
  );
};

export const nar = <A, B extends A>(
  accessor: Accessor<A>,
  cond: (x: A) => x is B,
): B | null => {
  const value = accessor();
  return cond(value) ? value : null;
};
