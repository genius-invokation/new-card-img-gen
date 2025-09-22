import { TYPE_TAG_IMG_NAME_MAP } from "./constants/maps";

export const tagImageUrl = (tag: string) => `/assets/UI_Gcg_Tag_${TYPE_TAG_IMG_NAME_MAP[tag]}.png`;
export const buffImageUrl = (buff: string) => `/assets/UI_Gcg_Buff_Common_${TYPE_TAG_IMG_NAME_MAP[buff]}.png`;
export const cardFaceUrl = (cardFace: string) => `images/${cardFace}.png`;
