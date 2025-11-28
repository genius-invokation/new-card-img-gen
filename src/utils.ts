import type { Accessor } from "solid-js";
import { TYPE_TAG_IMG_NAME_MAP } from "./constants";
import type { AllUnionFields } from "type-fest";
import type {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  ParsedChild,
  SkillRawData,
} from "./types";
import { ASSETS_API_ENDPOINT } from "./shared";

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
  return item.buffIcon
    ? assetsImageUrl(item.buffIcon)
    : item.icon
    ? assetsImageUrl(item.icon)
    : item.buffIconUrl ||
      item.iconUrl ||
      (item.type
        ? tagImageUrl(item.type)
        : `https://placehold.co/128x128?text=${encodeURIComponent(item.name)}`);
};

export const cardFaceUrl = (
  itemArg: AnyRawChild | AllUnionFields<AnyRawChild>,
) => {
  const item = itemArg as AllUnionFields<AnyRawChild>;
  return item.cardFace
    ? assetsImageUrl(item.cardFace)
    : item.cardFaceUrl ||
        `https://placehold.co/420x720?text=${encodeURIComponent(item.name)}`;
};

export const nar = <A, B extends A>(
  accessor: Accessor<A>,
  cond: (x: A) => x is B,
): B | null => {
  const value = accessor();
  return cond(value) ? value : null;
};

const FORM_VALUE_STORAGE_KEY = "card-img-gen-form-value";

export const saveFormValueToStorage = (formValue: unknown) => {
  try {
    localStorage.setItem(FORM_VALUE_STORAGE_KEY, JSON.stringify(formValue));
  } catch (error) {
    console.warn("保存表单值到 localStorage 失败:", error);
  }
};

export const loadFormValueFromStorage = <T>(): T | null => {
  try {
    const stored = localStorage.getItem(FORM_VALUE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.warn("从 localStorage 读取表单值失败:", error);
  }
  return null;
};