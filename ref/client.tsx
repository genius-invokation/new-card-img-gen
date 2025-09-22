const search = new URLSearchParams(window.location.search);
const beta = !!search.get("beta");

interface AppProps {
  language?: "en" | "zh";
  /**
   * - 为 true 时，读取本地 /data/en 和 /data/zh 的数据。
   * - 为 false 时，读取 genius-invokation(-beta) 的数据。
   */
  localData?: boolean;
  beta?: boolean;
  authorName?: string;
  authorImageUrl?: string;
  version?: `v${number}.${number}.${number}${"" | `-beta`}`;
  solo?: `${"C" | "A"}${number}`;
  mirroredLayout?: boolean;
  cardbackImage?: string;
  displayId?: boolean;
  displayStory?: boolean;
  /** debug模式下会显示相关实体，匹配方式粗糙，FP/TN均有 */
  debug?: boolean;
}

const APP_CONFIG: AppProps = {
  authorImageUrl: "",
  authorName: beta ? "Beta" : "",
  version: search.get("version") as any, // v5.5.0
  solo: search.get("id") as any, // A1503
  displayStory: !!search.get("display_story"),
  displayId: !!search.get("display_id"),
  mirroredLayout: !!search.get("mirrored_layout"),
  localData: !!search.get("local_data"),
  beta: beta,
};

// 新卡技能icon
const MISSING_ICONS_URL = {
  // 5.8
  15122: "/images/Skill_S_Lanyan_01.png",
  15123: "/images/Skill_E_Lanyan_01_HD.png",
  115121: "/images/UI_Gcg_Buff_Lanyan_E1.png",
  15132: "/images/Skill_S_Heizo_01.png",
  15133: "/images/Skill_E_Heizo_01_HD.png",
  15134: "/images/UI_Talent_S_Heizo_05.png",
  115132: "/images/UI_Gcg_Buff_Heizo_E1.png",
  115133: "/images/UI_Gcg_DeBuff_Heizo_S.png",
  115134: "/images/UI_Gcg_DeBuff_Heizo_S.png",
  115135: "/images/UI_Gcg_DeBuff_Heizo_S.png",
  115136: "/images/UI_Gcg_DeBuff_Heizo_S.png",
  27042: "/images/MonsterSkill_S_HookwalkerPrimo_01.png",
  27043: "/images/MonsterSkill_E_HookwalkerPrimo_01_HD.png",
  27044: "/images/MonsterSkill_S_HookwalkerPrimo_02.png",
} as Record<number, string>;

// 手动配置的child
const CHILDREN_CONFIG = {
  11142: "$[C111141],$[C111142],$[C111143]", // 茜特菈莉 E 有个不知道哪来的错误夜魂加持
  12082: "$[C112081],$[C112082]", // 妮露 E
  12102: "$[C112101],$[S12104]", // 那维莱特 E K1020=S12104
  12111: "_", // 芙宁娜 A  // 置空不能空着，随便写点啥，下同
  12142: "$[C112142],$[S1121422],$[C112143],$[C112141]", // 玛拉妮 E
  13141: "_", // 阿蕾奇诺 A
  13152:
    "$[C113151],$[C113154],$[S1131541],$[C113155],$[S1131551],$[C113156],$[S1131561],$[S13155]", // 玛薇卡 E
  14091: "_", // 丽莎 A
  14092: "$[C114091]", // 丽莎 E
  14121: "_", // 克洛琳德 A
  15114: "$[C115113],$[C115114],$[C115115],$[C115116],$[C115117]", // 恰斯卡 P
  15133: "$[C115133],$[C115134],$[C115135],$[C115136]", // 鹿野院 Q
  16063: "$[C116062]", // 五郎 Q
  16092: "$[C116091],$[C116092],$[C116093],$[C116095],$[C116096]", // 千织 E
  216091: "$[C116094]", // 千织 天赋
  16111: "_", // 希诺宁 A
  16113: "_", // 希诺宁 Q
  17082: "$[C117082]", // 卡维 E
  21022: "$[C121022]", // 女士 E
  21023: "_", // 女士 Q
  21024: "$[C121021],$[K1013],$[S63011],$[S63012],$[S63013],$[C163011]", // 女士 P
  221031: "$[C121022]", // 无相冰 天赋
  22012: "$[C122011],$[C122012],$[C122013]", // 纯水精灵 E1
  22013: "_", // 纯水精灵 E2
  22052: "_", // 水丘丘 E
  22053: "$[C122051],$[S1220511],$[S1220512]$[C122052]", // 水丘丘 Q
  23032: "$[C123032]", // 火镀金旅团 E
  27032: "$[C127033]", // 草镀金旅团 E
  322027:
    "$[C302206],$[C302207],$[C302208],$[C302209],$[C302210],$[C302211],$[C302212],$[C302213],$[C302214],$[C302215]", // 瑟琳
  331702: "_", // 草共鸣
  332016: "$[C303216],$[C303217],$[C303218],$[C303219]", // 愚人众的阴谋
  332032: "$[C332033],$[C332034],$[C332035]", // 幻戏倒计时
  333020: "$[C333021],$[C333022],$[C333023],$[C333024],$[C333025],$[C333026]", // 奇瑰之汤
  333027: "_", // 纵声欢唱
} as Record<number, string>;

// 需要展示的规则解释ID
const SHOWN_KEYWORDS = [1012, 1013];

// 费用只读的ID，全部实体都写在这，准备技能已经做了特判不用写了
const COST_READONLY_ENTITIES = [
  112131, 112132, 112133, 112142, 115112, 116102, 116112, 333021, 333022,
  333023, 333024, 333025, 333026,
];

import "./style.css";
import { createRoot } from "react-dom/client";
import {
  type ActionCardRawData,
  type CharacterRawData,
  type EntityRawData,
  type KeywordRawData,
  type PlayCost,
  type SkillRawData,
} from "@gi-tcg/static-data";

import React, { createContext, useContext, useEffect, useState } from "react";

// ID纠错 //目前仅芙宁娜
const correctId = {
  12123: 12112,
} as Record<number, number>;

declare global {
  interface WindowEventMap {
    config: CustomEvent<AppProps>;
  }
}
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
declare module "@gi-tcg/static-data" {
  interface SkillRawData {
    hidden?: boolean;
  }
}

const CARD_BACK_FRAME = "/assets/frame/avatar_card_frame_2.png";
const CARD_NORMAL_FRAME = "/assets/frame/card_frame_normal.png";
const CARD_LEGEND_FRAME = "/assets/frame/card_frame_legend.png";
const AVATAR_CARD_HP = "/assets/frame/UI_TeyvatCard_LifeBg.png";
const AVATAR_CARD_ENERGY = "/assets/frame/UI_TeyvatCard_LifeBg3.png";
const KEYWORD_CARD_FRAME = "/assets/frame/keyword_card_frame.png";
// const keyword_card_shadow = "/assets/frame/keyword_card_shadow.png";
const KEYWORD_CARDBACK_REPEAT = "/assets/frame/UI_Gcg_CardBack_Repeat.png";
const KEYWORD_CARDBACK_BOTTOM = "/assets/frame/UI_Gcg_CardBack_Bottom.png";
const PAGE_TITLE_ICON = "/assets/frame/pagetitle.png";

// 特殊能量，卡图右侧的能量条
const SPECIAL_ENERGY_MAP = {
  1315: { type: "/assets/frame/UI_TeyvatCard_LifeBg_Mavuika1.png", count: 3 },
} as Record<number, { type: string; count: number }>;

const COST_TYPE_IMG_NAME_MAP = {
  GCG_COST_DICE_VOID: "Diff",
  GCG_COST_DICE_CRYO: "Ice",
  GCG_COST_DICE_HYDRO: "Water",
  GCG_COST_DICE_PYRO: "Fire",
  GCG_COST_DICE_ELECTRO: "Electric",
  GCG_COST_DICE_ANEMO: "Wind",
  GCG_COST_DICE_GEO: "Rock",
  GCG_COST_DICE_DENDRO: "Grass",
  GCG_COST_DICE_SAME: "Same",
  GCG_COST_ENERGY: "Energy",
  GCG_COST_LEGEND: "Legend",
  GCG_COST_SPECIAL_ENERGY: "Energy_Mavuika",
} as Record<string, string>;

const TYPE_TAG_TEXT_MAP = {
  zh: {
    GCG_RULE_EXPLANATION: "规则解释",
    GCG_SKILL_TAG_A: "普通攻击",
    GCG_SKILL_TAG_E: "元素战技",
    GCG_SKILL_TAG_Q: "元素爆发",
    GCG_SKILL_TAG_PASSIVE: "被动技能",
    GCG_SKILL_TAG_VEHICLE: "特技",
    GCG_CARD_EVENT: "事件牌",
    GCG_CARD_ONSTAGE: "出战状态",
    GCG_CARD_STATE: "状态",
    GCG_CARD_SUMMON: "召唤物",
    GCG_CARD_ASSIST: "支援牌",
    GCG_CARD_MODIFY: "装备牌",
    GCG_TAG_ELEMENT_CRYO: "冰元素",
    GCG_TAG_ELEMENT_HYDRO: "水元素",
    GCG_TAG_ELEMENT_PYRO: "火元素",
    GCG_TAG_ELEMENT_ELECTRO: "雷元素",
    GCG_TAG_ELEMENT_ANEMO: "风元素",
    GCG_TAG_ELEMENT_GEO: "岩元素",
    GCG_TAG_ELEMENT_DENDRO: "草元素",
    GCG_TAG_NATION_MONDSTADT: "蒙德",
    GCG_TAG_NATION_LIYUE: "璃月",
    GCG_TAG_NATION_INAZUMA: "稻妻",
    GCG_TAG_NATION_SUMERU: "须弥",
    GCG_TAG_NATION_FONTAINE: "枫丹",
    GCG_TAG_NATION_NATLAN: "纳塔",
    GCG_TAG_NATION_SNEZHNAYA: "至冬",
    GCG_TAG_CAMP_ERIMITE: "镀金旅团",
    GCG_TAG_CAMP_FATUI: "愚人众",
    GCG_TAG_CAMP_MONSTER: "魔物",
    GCG_TAG_CAMP_SACREAD: "圣骸兽",
    GCG_TAG_CAMP_HILICHURL: "丘丘人",
    GCG_TAG_ARKHE_PNEUMA: "始基力：荒性",
    GCG_TAG_ARKHE_OUSIA: "始基力：芒性",
    GCG_TAG_WEAPON: "武器",
    GCG_TAG_WEAPON_BOW: "弓",
    GCG_TAG_WEAPON_SWORD: "单手剑",
    GCG_TAG_WEAPON_CLAYMORE: "双手剑",
    GCG_TAG_WEAPON_POLE: "长柄武器",
    GCG_TAG_WEAPON_CATALYST: "法器",
    GCG_TAG_WEAPON_NONE: "其它武器",
    GCG_TAG_ARTIFACT: "圣遗物",
    GCG_TAG_TALENT: "天赋",
    GCG_TAG_VEHICLE: "特技",
    GCG_TAG_LEGEND: "秘传",
    GCG_TAG_FOOD: "料理",
    GCG_TAG_RESONANCE: "元素共鸣",
    GCG_TAG_PLACE: "场地",
    GCG_TAG_ALLY: "伙伴",
    GCG_TAG_ITEM: "道具",
    GCG_TAG_PREPARE_SKILL: "准备技能",
    GCG_TAG_NYX_STATE: "夜魂加持",
    GCG_TAG_SHEILD: "护盾",
    GCG_TAG_DENDRO_PRODUCE: "草元素相关反应",
    GCG_TAG_FALL_ATTACK: "下落攻击",
    GCG_TAG_FORBIDDEN_ATTACK: "无法使用技能",
    GCG_TAG_IMMUNE_CONTROL: "免疫控制",
    GCG_TAG_IMMUNE_FREEZING: "免疫冻结",
    GCG_TAG_SLOWLY: "战斗行动",
    GCG_TAG_NATION_SIMULANKA: "希穆兰卡",
  },
  en: {
    GCG_RULE_EXPLANATION: "Detailed Rules",
    GCG_SKILL_TAG_A: "Normal Attack",
    GCG_SKILL_TAG_E: "Elemental Skill",
    GCG_SKILL_TAG_Q: "Elemental Burst",
    GCG_SKILL_TAG_PASSIVE: "Passive Skill",
    GCG_SKILL_TAG_VEHICLE: "Technique",
    GCG_CARD_EVENT: "Event Card",
    GCG_CARD_ONSTAGE: "Combat Status",
    GCG_CARD_STATE: "Status",
    GCG_CARD_SUMMON: "Summon",
    GCG_CARD_ASSIST: "Support Card",
    GCG_CARD_MODIFY: "Equipment Card",
    GCG_TAG_ELEMENT_CRYO: "Cryo",
    GCG_TAG_ELEMENT_HYDRO: "Hydro",
    GCG_TAG_ELEMENT_PYRO: "Pyro",
    GCG_TAG_ELEMENT_ELECTRO: "Electro",
    GCG_TAG_ELEMENT_ANEMO: "Anemo",
    GCG_TAG_ELEMENT_GEO: "Geo",
    GCG_TAG_ELEMENT_DENDRO: "Dendro",
    GCG_TAG_NATION_MONDSTADT: "Mondstadt",
    GCG_TAG_NATION_LIYUE: "Liyue",
    GCG_TAG_NATION_INAZUMA: "Inazuma",
    GCG_TAG_NATION_SUMERU: "Sumeru",
    GCG_TAG_NATION_FONTAINE: "Fontaine",
    GCG_TAG_NATION_NATLAN: "Natlan",
    GCG_TAG_NATION_SNEZHNAYA: "Snezhnaya",
    GCG_TAG_CAMP_ERIMITE: "The Eremites",
    GCG_TAG_CAMP_FATUI: "Fatui",
    GCG_TAG_CAMP_MONSTER: "Monster",
    GCG_TAG_CAMP_SACREAD: "Sacread",
    GCG_TAG_CAMP_HILICHURL: "Hilichurl",
    GCG_TAG_ARKHE_PNEUMA: "Arkhe: Pneuma",
    GCG_TAG_ARKHE_OUSIA: "Arkhe: Ousia",
    GCG_TAG_WEAPON: "Weapon",
    GCG_TAG_WEAPON_BOW: "Bow",
    GCG_TAG_WEAPON_SWORD: "Sword",
    GCG_TAG_WEAPON_CLAYMORE: "Claymore",
    GCG_TAG_WEAPON_POLE: "Polearm",
    GCG_TAG_WEAPON_CATALYST: "Catalyst",
    GCG_TAG_WEAPON_NONE: "Other Weapon",
    GCG_TAG_ARTIFACT: "Artifact",
    GCG_TAG_TALENT: "Talent",
    GCG_TAG_VEHICLE: "Technique",
    GCG_TAG_LEGEND: "Arcane Legend",
    GCG_TAG_FOOD: "Food",
    GCG_TAG_RESONANCE: "Elemental Resonance",
    GCG_TAG_PLACE: "Location",
    GCG_TAG_ALLY: "Companion",
    GCG_TAG_ITEM: "Item",
    GCG_TAG_PREPARE_SKILL: "Prepare Skill",
    GCG_TAG_NYX_STATE: "Nightsoul's Blessing State",
    GCG_TAG_SHEILD: "Sheild",
    GCG_TAG_DENDRO_PRODUCE: "Dendro-Related Reactions",
    GCG_TAG_FALL_ATTACK: "Plunging Attack",
    GCG_TAG_FORBIDDEN_ATTACK: "Cannot Use Skills",
    GCG_TAG_IMMUNE_CONTROL: "Immune to Control",
    GCG_TAG_IMMUNE_FREEZING: "Immune to Frozen",
    GCG_TAG_SLOWLY: "Combat Action",
  },
} as Record<string, Record<string, string>>;

const TYPE_TAG_IMG_NAME_MAP = {
  GCG_CARD_EVENT: "Custom_ActionCard",
  GCG_CARD_ONSTAGE: "Custom_Summon",
  GCG_CARD_STATE: "Custom_Summon",
  GCG_CARD_SUMMON: "Custom_Summon",
  GCG_CARD_ASSIST: "Custom_ActionCard",
  GCG_CARD_MODIFY: "Custom_ActionCard",
  GCG_TAG_ELEMENT_CRYO: "Element_Ice",
  GCG_TAG_ELEMENT_HYDRO: "Element_Water",
  GCG_TAG_ELEMENT_PYRO: "Element_Fire",
  GCG_TAG_ELEMENT_ELECTRO: "Element_Electric",
  GCG_TAG_ELEMENT_ANEMO: "Element_Wind",
  GCG_TAG_ELEMENT_GEO: "Element_Rock",
  GCG_TAG_ELEMENT_DENDRO: "Element_Grass",
  GCG_TAG_NATION_MONDSTADT: "Faction_Mondstadt",
  GCG_TAG_NATION_LIYUE: "Faction_Liyue",
  GCG_TAG_NATION_INAZUMA: "Faction_Inazuma",
  GCG_TAG_NATION_SUMERU: "Faction_Sumeru",
  GCG_TAG_NATION_FONTAINE: "Faction_Fontaine",
  GCG_TAG_NATION_NATLAN: "Faction_Natlan",
  GCG_TAG_NATION_SNEZHNAYA: "Faction_Snezhnaya",
  GCG_TAG_CAMP_ERIMITE: "Faction_Erimite",
  GCG_TAG_CAMP_FATUI: "Faction_Fatui",
  GCG_TAG_CAMP_MONSTER: "Faction_Monster",
  GCG_TAG_CAMP_SACREAD: "Faction_Sacred",
  GCG_TAG_CAMP_HILICHURL: "Faction_Hili",
  GCG_TAG_ARKHE_PNEUMA: "Faction_Pneuma",
  GCG_TAG_ARKHE_OUSIA: "Faction_Ousia",
  GCG_TAG_WEAPON: "Card_Weapon",
  GCG_TAG_WEAPON_BOW: "Weapon_Bow",
  GCG_TAG_WEAPON_SWORD: "Weapon_Sword",
  GCG_TAG_WEAPON_CLAYMORE: "Weapon_Claymore",
  GCG_TAG_WEAPON_POLE: "Weapon_Polearm",
  GCG_TAG_WEAPON_CATALYST: "Weapon_Catalyst",
  GCG_TAG_WEAPON_NONE: "Weapon_None",
  GCG_TAG_ARTIFACT: "Card_Relic",
  GCG_TAG_TALENT: "Card_Talent",
  GCG_TAG_VEHICLE: "Card_Vehicle",
  GCG_TAG_LEGEND: "Card_Legend",
  GCG_TAG_FOOD: "Card_Food",
  GCG_TAG_RESONANCE: "Card_Sync",
  GCG_TAG_PLACE: "Card_Location",
  GCG_TAG_ALLY: "Card_Ally",
  GCG_TAG_ITEM: "Card_Item",
  GCG_TAG_SLOWLY: "Card_CombatAction",
} as Record<string, string>;

const diceImageUrl = (type: string) =>
  `/assets/UI_Gcg_DiceL_${COST_TYPE_IMG_NAME_MAP[type]}_Glow_HD.png`;

const tagImageUrl = (tag: string) =>
  `/assets/UI_Gcg_Tag_${TYPE_TAG_IMG_NAME_MAP[tag]}.png`;

const buffImageUrl = (buff: string) =>
  `/assets/UI_Gcg_Buff_Common_${TYPE_TAG_IMG_NAME_MAP[buff]}.png`;

const cardFaceUrl = (cardFace: string) => `images/${cardFace}.png`;

interface DescriptionIconImage {
  imageUrl?: string;
  tagIcon?: string;
}

const DESCRIPTION_ICON_IMAGES = {
  4007: { imageUrl: `/assets/UI_Gcg_Keyword_Shield.png` },
  2100: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Physics.png` },
  2101: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Ice.png` },
  2102: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Water.png` },
  2103: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Fire.png` },
  2104: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Electric.png` },
  2105: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Wind.png` },
  2106: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Rock.png` },
  2107: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Grass.png` },
  1101: { imageUrl: `/assets/UI_Gcg_DiceL_Ice.png` },
  1102: { imageUrl: `/assets/UI_Gcg_DiceL_Water.png` },
  1103: { imageUrl: `/assets/UI_Gcg_DiceL_Fire.png` },
  1104: { imageUrl: `/assets/UI_Gcg_DiceL_Elec.png` },
  1105: { imageUrl: `/assets/UI_Gcg_DiceL_Wind.png` },
  1106: { imageUrl: `/assets/UI_Gcg_DiceL_Rock.png` },
  1107: { imageUrl: `/assets/UI_Gcg_DiceL_Grass.png` },
  1108: { imageUrl: `/assets/UI_Gcg_DiceL_Same.png` },
  1109: { imageUrl: `/assets/UI_Gcg_DiceL_Diff.png` },
  1110: { imageUrl: `/assets/UI_Gcg_Keyword_Energy.png` },
  1111: { imageUrl: `/assets/UI_Gcg_DiceL_Any.png` },
  1112: { imageUrl: `/assets/UI_Gcg_Keyword_Legend.png` },
  // 1113: "元素精通",
  4008: { imageUrl: `/assets/UI_Gcg_Keyword_Fighting_Spirit.png` },
  3003: { tagIcon: "GCG_TAG_WEAPON" },
  3004: { tagIcon: "GCG_TAG_ARTIFACT" },
  3006: { tagIcon: "GCG_TAG_TALENT" },
  3007: { tagIcon: "GCG_TAG_LEGEND" },
  3008: { tagIcon: "GCG_TAG_VEHICLE" },
  3101: { tagIcon: "GCG_TAG_FOOD" },
  3102: { tagIcon: "GCG_TAG_ITEM" },
  3103: { tagIcon: "GCG_TAG_ALLY" },
  3104: { tagIcon: "GCG_TAG_PLACE" },
  3200: { tagIcon: "GCG_TAG_WEAPON_NONE" },
  3201: { tagIcon: "GCG_TAG_WEAPON_CATALYST" },
  3202: { tagIcon: "GCG_TAG_WEAPON_BOW" },
  3203: { tagIcon: "GCG_TAG_WEAPON_CLAYMORE" },
  3204: { tagIcon: "GCG_TAG_WEAPON_POLE" },
  3205: { tagIcon: "GCG_TAG_WEAPON_SWORD" },
  3401: { tagIcon: "GCG_TAG_NATION_MONDSTADT" },
  3402: { tagIcon: "GCG_TAG_NATION_LIYUE" },
  3403: { tagIcon: "GCG_TAG_NATION_INAZUMA" },
  3404: { tagIcon: "GCG_TAG_NATION_SUMERU" },
  3405: { tagIcon: "GCG_TAG_NATION_FONTAINE" },
  3406: { tagIcon: "GCG_TAG_NATION_NATLAN" },
  3407: { tagIcon: "GCG_TAG_NATION_SNEZHNAYA" },
  3501: { tagIcon: "GCG_TAG_CAMP_FATUI" },
  3502: { tagIcon: "GCG_TAG_CAMP_HILICHURL" },
  3503: { tagIcon: "GCG_TAG_CAMP_MONSTER" },
  3504: { tagIcon: "GCG_TAG_ARKHE_PNEUMA" },
  3505: { tagIcon: "GCG_TAG_ARKHE_OUSIA" },
  // ?: { tagIcon: "GCG_TAG_CAMP_SACREAD" },
  // ?: { tagIcon: "GCG_TAG_CAMP_ERIMITE" },
} as Record<number, DescriptionIconImage>;

const KEYWORD_COLORS = {
  310: "#d8b456",
  100: "#d9b253",
  101: "#63bacd",
  102: "#488ccb",
  103: "#d6684b",
  104: "#917ce8",
  105: "#5ca8a6",
  106: "#d29d5d",
  107: "#88b750",
  150: "#d9b253",
  151: "#63bacd",
  152: "#488ccb",
  153: "#d6684b",
  154: "#917ce8",
  155: "#5ca8a6",
  156: "#d29d5d",
  157: "#88b750",
  200: "#d9b253",
  201: "#63bacd",
  202: "#488ccb",
  203: "#d6684b",
  204: "#917ce8",
  205: "#5ca8a6",
  206: "#d29d5d",
  207: "#88b750",
  210: "#d9b253",
  211: "#63bacd",
  212: "#488ccb",
  213: "#d6684b",
  214: "#917ce8",
  215: "#5ca8a6",
  216: "#d29d5d",
  217: "#88b750",
  250: "#d9b253",
  251: "#63bacd",
  252: "#488ccb",
  253: "#d6684b",
  254: "#917ce8",
  255: "#5ca8a6",
  256: "#d29d5d",
  257: "#88b750",
  260: "#d9b253",
  261: "#63bacd",
  262: "#488ccb",
  263: "#d6684b",
  264: "#917ce8",
  265: "#5ca8a6",
  266: "#d29d5d",
  267: "#88b750",
  300: "#d9b253",
  301: "#63bacd",
  302: "#488ccb",
  303: "#d6684b",
  304: "#917ce8",
  305: "#5ca8a6",
  306: "#d29d5d",
  307: "#88b750",
} as Record<number, string>;

interface ParsedCharacter extends CharacterRawData {
  parsedSkills: ParsedSkill[];
}
interface ParsedSkill extends SkillRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
interface ParsedEntity extends EntityRawData {
  parsedDescription: ParsedDescription;
}
interface ParsedActionCard extends ActionCardRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
interface ParsedKeyword extends KeywordRawData {
  parsedDescription: ParsedDescription;
}

type ParsedChild =
  | ParsedSkill
  | ParsedEntity
  | ParsedActionCard
  | ParsedKeyword;

type TokenStyle = "strong" | "light" | "dimmed";

type DescriptionToken =
  | {
      type: "plain";
      text: string;
      style: () => TokenStyle | "normal";
      color?: string;
    }
  | {
      type: "boxedKeyword";
      text: string;
    }
  | {
      type: "hiddenKeyword";
      id: number;
    }
  | {
      type: "reference";
      refType: string;
      id: number;
      overrideStyle: () => TokenStyle | undefined;
      // 手动指定天赋牌引用角色/技能的颜色
      manualColor?: string;
    }
  | {
      type: "errored";
      text: string;
    }
  | {
      type: "lineBreak";
    }
  | {
      type: "icon";
      id: number;
      overrideStyle: () => TokenStyle | undefined;
    };

type ParsedDescription = DescriptionToken[];

interface AppContextValue extends AppProps {
  data: {
    characters: CharacterRawData[];
    actionCards: ActionCardRawData[];
    entities: EntityRawData[];
    genericEntities: (EntityRawData | ActionCardRawData)[];
    skills: SkillRawData[];
    keywords: KeywordRawData[];
  };
  supIds: number[];
  names: Map<number, string>;
  keywordToEntityMap: Map<number, number>;
  // 从准备技能skill.id到准备技能state.id的映射
  prepareSkillToEntityMap: Map<number, number>;
}

const AppContext = createContext<AppContextValue>({
  data: {
    characters: [],
    actionCards: [],
    entities: [],
    genericEntities: [],
    skills: [],
    keywords: [],
  },
  supIds: [],
  names: new Map<number, string>(),
  keywordToEntityMap: new Map<number, number>(),
  prepareSkillToEntityMap: new Map<number, number>(),
});

const useAppContext = () => useContext(AppContext);

const DAMAGE_KEYWORD_MAP = {
  GCG_ELEMENT_PHYSIC: 100,
  GCG_ELEMENT_CRYO: 101,
  GCG_ELEMENT_HYDRO: 102,
  GCG_ELEMENT_PYRO: 103,
  GCG_ELEMENT_ELECTRO: 104,
  GCG_ELEMENT_ANEMO: 105,
  GCG_ELEMENT_GEO: 106,
  GCG_ELEMENT_DENDRO: 107,
} as Record<string, number>;

// 为debug准备的筛选有关id的功能
const getRelatedIds = (
  ctx: AppContextValue,
  character: CharacterRawData,
): number[] => {
  const { data } = ctx;
  // 角色关联 仅Debug用
  const VariantCharacters = {
    1211: [1212],
    2102: [6301],
    2602: [6601, 6602, 6603, 6604],
  } as Record<number, number[]>;
  const variants = VariantCharacters[character.id] || [];
  const allCharacterIds = [character.id, ...variants];
  const skillIds = data.characters
    .filter((c) => allCharacterIds.includes(c.id))
    .flatMap((c) => c.skills.map((s) => s.id));
  const cardIds = data.actionCards.flatMap((c) => {
    const idStr = c.id.toString();
    return idStr.length === 6 &&
      (idStr[0] === "1" || idStr[0] === "2") &&
      allCharacterIds.includes(Number(idStr.slice(1, 5)))
      ? [c.id]
      : [];
  });
  const relatedEntity = data.entities.filter((e) => {
    const idStr = e.id.toString();
    return (
      idStr.length === 6 &&
      (idStr[0] === "1" || idStr[0] === "2") &&
      allCharacterIds.includes(Number(idStr.slice(1, 5)))
    );
  });
  const entityIds = relatedEntity.map((e) => e.id);
  const entitySkillIds = relatedEntity.flatMap(
    (e) => e.skills?.map((s) => s.id) || [],
  );
  return Array.from(
    new Set([
      character.id,
      ...variants,
      ...skillIds,
      ...cardIds,
      ...entityIds,
      ...entitySkillIds,
    ]),
  );
};

const BOLD_COLOR = "#FFFFFFFF";

const remapColors = (props: {
  color: string | undefined;
  style?: "text" | "outline";
}) => {
  const COLOR_MAPS = {
    "#99FFFFFF": { textColor: "#63bacd", outlineColor: "#68c4d9" }, // 冰
    "#80C0FFFF": { textColor: "#488ccb", outlineColor: "#4c95d9" }, // 水
    "#FF9999FF": { textColor: "#d6684b", outlineColor: "#e06e4f" }, // 火
    "#FFACFFFF": { textColor: "#917ce8", outlineColor: "#967ff0" }, // 雷
    "#80FFD7FF": { textColor: "#5ca8a6", outlineColor: "#68bdba" }, // 风
    "#FFE699FF": { textColor: "#d29d5d", outlineColor: "#dba460" }, // 岩
    "#7EC236FF": { textColor: "#88b750", outlineColor: "#97c959" }, // 草
  } as Record<string, Record<string, string>>;
  if (!props.color) {
    return;
  }
  if (props.style === "outline") {
    return COLOR_MAPS[props.color]
      ? COLOR_MAPS[props.color].outlineColor
      : props.color;
  }
  return COLOR_MAPS[props.color]
    ? COLOR_MAPS[props.color].textColor
    : props.color;
};

const parseDescription = (
  ctx: AppContextValue,
  rawDescription: string,
  keyMap: Record<string, string> = {},
  ignoreParentheses = false,
): ParsedDescription => {
  const { names, data, keywordToEntityMap } = ctx;
  const segments = rawDescription
    .replace(/<color=#FFFFFFFF>(\$\[[ACSK]\d+\])<\/color>/g, "$1")
    .replace(/<color=#([0-9A-F]{8})>/g, "###COLOR#$1###")
    .replace(/<\/color>/g, "###/COLOR###")
    .replace(/\$\[K(3|4)\](?::\s|：)(\d+)/g, "###BOXED#$1#$2###")
    .replace(/[（(]/g, "###LBRACE###（")
    .replace(/[）)]/g, "）###RBRACE###")
    .replace(/(\\n)+/g, "###BR###")
    .replace(/\$\{(.*?)\}/g, (_, g1: string) => {
      return keyMap[g1] ?? "";
    })
    .replace(/\{SPRITE_PRESET#(\d+)\}/g, "###SPRITE#$1###")
    .replace(/\$\[(.*?)\]/g, "###REF#$1###")
    .split("###");
  const result: DescriptionToken[] = [];
  interface ColorInfo {
    rawColor: string;
    readonly isBold: boolean;
    isConditionBold: boolean;
  }
  interface ParenthesisInfo {
    afterBr: boolean;
  }
  const colors: ColorInfo[] = [];
  const parentheses: ParenthesisInfo[] = [];
  for (const text of segments) {
    const lastToken = result[result.length - 1];
    const rootColor = colors[0];
    const currentColor = colors[colors.length - 1];
    const rootParenthesis = parentheses[0];
    const color = currentColor?.isBold ? void 0 : currentColor?.rawColor;
    const styles = {
      overrideStyle() {
        return rootParenthesis?.afterBr
          ? "light"
          : rootColor?.isConditionBold
          ? "dimmed"
          : rootColor?.isBold
          ? "strong"
          : void 0;
      },
      style() {
        return this.overrideStyle() ?? "normal";
      },
    };
    // const when = colons.length > 0;
    if (text === "BR") {
      result.push({ type: "lineBreak" });
    } else if (text === "LBRACE") {
      if (!ignoreParentheses) {
        parentheses.push({
          afterBr:
            lastToken?.type === "lineBreak" ||
            lastToken?.type === "boxedKeyword",
        });
      }
    } else if (text === "RBRACE") {
      if (!ignoreParentheses) {
        parentheses.pop();
      }
    } else if (text.startsWith("COLOR#")) {
      const rawColor = text.substring(5, 14);
      colors.push({
        rawColor,
        isBold: rawColor === BOLD_COLOR,
        isConditionBold: false,
      });
    } else if (text === "/COLOR") {
      const lastColor = colors.pop();
      if (
        lastToken?.type === "plain" &&
        /[:：]$/.test(lastToken.text) && //lastToken.text.endsWith("：")
        lastColor?.isBold
      ) {
        lastColor.isConditionBold = true;
      }
    } else if (text.startsWith("REF#")) {
      const ref = text.substring(4);
      let usingKeywordId: number | null = null;
      if (ref === "D__KEY__ELEMENT") {
        const damageType = keyMap[ref];
        if (!damageType || !DAMAGE_KEYWORD_MAP[damageType]) {
          result.push({ type: "errored", text: ref });
          continue;
        }
        usingKeywordId = DAMAGE_KEYWORD_MAP[damageType];
      } else if (keyMap[ref]) {
        result.push({ type: "plain", text: keyMap[ref], ...styles });
        continue;
      } else {
        const refType = ref[0];
        let id = Number(ref.substring(1));
        let manualColor: string | undefined = undefined;
        if (refType === "K") {
          const mappedC = keywordToEntityMap.get(id);
          if (mappedC) {
            result.push({
              type: "reference",
              refType: "C",
              id: mappedC,
              manualColor,
              ...styles,
            });
          } else {
            usingKeywordId = id;
          }
        } else if (names.get(id) || id in correctId) {
          id = names.get(id) ? id : correctId[id];
          if (refType === "A") {
            manualColor = KEYWORD_COLORS[100 + (Math.floor(id / 100) % 10)];
          } else if (refType === "S" && id.toString().length === 5) {
            manualColor =
              KEYWORD_COLORS[100 + Number(id.toString().slice(-4, -3))];
          }
          result.push({
            type: "reference",
            refType,
            id,
            manualColor,
            ...styles,
          });
        } else {
          result.push({ type: "errored", text: `${refType}${id}` });
        }
      }
      if (usingKeywordId !== null) {
        const keyword = data.keywords.find((e) => e.id === usingKeywordId);
        if (keyword) {
          const rawName = keyword.rawName.split("|s1:").pop()!;
          result.push(
            { type: "hiddenKeyword", id: usingKeywordId },
            ...parseDescription(ctx, rawName).map((token) => {
              if (token.type === "plain") {
                return {
                  ...token,
                  style: () => {
                    const outerStyle = styles.style();
                    return outerStyle === "normal" ? token.style() : outerStyle;
                  },
                  color: KEYWORD_COLORS[usingKeywordId] ?? token.color,
                } as const;
              } else if (token.type === "reference" || token.type === "icon") {
                return {
                  ...token,
                  // ...styles,
                  overrideStyle: () => {
                    const outerStyle = styles.overrideStyle();
                    return outerStyle ?? token.overrideStyle();
                  },
                } as const;
              } else {
                return token;
              }
            }),
          );
        } else {
          result.push({ type: "errored", text: `K${usingKeywordId}` });
        }
      }
    } else if (text.startsWith("BOXED#")) {
      const [_, id, count] = text.split("#");
      const keywordId = Number(id);
      const { name } = data.keywords.find((e) => e.id === keywordId) ?? {
        name: "",
      };
      result.push({
        type: "boxedKeyword",
        text: `${name}：${count}`,
      });
    } else if (text.startsWith("SPRITE#")) {
      const id = Number(text.substring(7));
      result.push({
        type: "icon",
        id,
        ...styles,
      });
    } else if (text) {
      result.push({
        type: "plain",
        text,
        color,
        ...styles,
      });
    }
  }
  return result;
};

const appendChildren = (
  ctx: AppContextValue,
  childData: ChildData,
  scope: "all" | "self" | "children" = "all",
): ParsedChild[] => {
  const { data } = ctx;
  const parsedDescription = parseDescription(
    ctx,
    childData.rawDescription,
    "keyMap" in childData ? childData.keyMap : {},
  );
  const result: ParsedChild[] = [];
  if (scope !== "children") {
    const self = {
      ...childData,
      parsedDescription,
    } as ParsedChild;
    result.push(self);

    if (
      "tags" in childData &&
      childData.tags.includes("GCG_TAG_VEHICLE") &&
      "skills" in childData
    ) {
      let moveBuffIcon = false;
      for (const skill of childData.skills) {
        if (skill.type === "GCG_SKILL_TAG_VEHICLE") {
          // @ts-expect-error
          skill.buffIcon = childData.buffIcon;
          moveBuffIcon = true;
        }
      }
      if (moveBuffIcon) {
        // @ts-expect-error
        delete self.buffIcon;
      }
    }
  }
  if (scope === "self") {
    return result;
  }

  const manuallyConfigChilren = CHILDREN_CONFIG[childData.id];
  const subScope = manuallyConfigChilren ? "self" : "all";
  const children = manuallyConfigChilren
    ? parseDescription(ctx, manuallyConfigChilren)
    : parsedDescription;
  for (const child of children) {
    if (child.type === "reference") {
      if (ctx.supIds.includes(child.id)) {
        continue;
      }
      ctx.supIds.push(child.id);
      switch (child.refType) {
        case "S": {
          const skillData = data.skills.find((sk) => sk.id === child.id);
          if (!skillData) {
            continue;
          }
          result.push(...appendChildren(ctx, skillData, subScope));
          break;
        }
        case "C": {
          const entityData = data.genericEntities
            .filter((e) => e.id === child.id)
            .reduce(
              (acc, e) => ({
                ...acc,
                ...e,
              }),
              {} as EntityRawData & ActionCardRawData,
            );
          if (!entityData) {
            continue;
          }
          result.push(...appendChildren(ctx, entityData, subScope));
          break;
        }
        case "A": {
          break;
        }
      }
    } else if (
      child.type === "hiddenKeyword" &&
      SHOWN_KEYWORDS.includes(child.id)
    ) {
      if (ctx.supIds.includes(-child.id)) {
        continue;
      }
      ctx.supIds.push(-child.id);
      const keywordData = data.keywords.find((e) => e.id === child.id);
      if (keywordData) {
        result.push({
          ...keywordData,
          type: "GCG_RULE_EXPLANATION",
          parsedDescription: parseDescription(ctx, keywordData.rawDescription),
        });
      }
    }
  }
  return result;
};

const parseCharacterSkill = (
  ctx: AppContextValue,
  skill: SkillRawData,
): ParsedSkill => {
  const parsedDescription = parseDescription(
    ctx,
    skill.rawDescription,
    skill.keyMap,
    true,
  );
  // suppressedReferencedIds.push(skill.id);
  const children = appendChildren(ctx, skill, "children");
  return {
    ...skill,
    parsedDescription,
    children,
  };
};

const parseCharacter = (
  ctx: AppContextValue,
  data: CharacterRawData,
): ParsedCharacter => {
  ctx.supIds.push(...data.skills.flatMap((sk) => (sk.hidden ? [] : [sk.id])));
  const parsedSkills = data.skills.flatMap((skill) =>
    skill.hidden ? [] : [parseCharacterSkill(ctx, skill)],
  );
  return {
    ...data,
    parsedSkills,
  };
};

const parseActionCard = (
  ctx: AppContextValue,
  data: ActionCardRawData,
): ParsedActionCard => {
  ctx.supIds.push(data.id);
  return {
    ...data,
    parsedDescription: parseDescription(ctx, data.rawDescription),
    children: appendChildren(ctx, data, "children"),
  };
};

/** 处理中间点间距 */
const Text = ({ text }: { text: string | undefined | null }) => {
  const { language = "zh" } = useAppContext();
  if (language === "en") {
    return <span className="english-text">{text}</span>;
  }

  if (typeof text !== "string" || !text.includes("·")) return text;
  return text.split("·").flatMap((part, i, arr) =>
    i < arr.length - 1
      ? [
          part,
          <span key={i} className="middot">
            ·
          </span>,
        ]
      : [part],
  );
};

type TagType = "character" | "cardType" | "cardTag";

const Tag = (props: { type: TagType; tag: string; className?: string }) => {
  const { language = "zh" } = useAppContext();
  return (
    TYPE_TAG_TEXT_MAP[language][props.tag] && (
      <div
        className={`tag ${props.className ?? ""}`}
        data-tag-type={props.type}
      >
        <div className="tag-icon-container">
          {props.tag.startsWith("GCG_TAG_ELEMENT_") ? (
            <img className="tag-icon-image" src={buffImageUrl(props.tag)} />
          ) : (
            <div
              className="tag-icon-mask"
              style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
            />
          )}
        </div>
        <div className="tag-text">
          <Text text={TYPE_TAG_TEXT_MAP[language][props.tag]} />
        </div>
      </div>
    )
  );
};

const Token = ({ token }: { token: DescriptionToken }) => {
  const { names } = useAppContext();
  switch (token.type) {
    case "plain":
      return (
        <span
          className={`description-${token.style()}`}
          style={{
            "--color": remapColors({ color: token.color }),
            "--outline": remapColors({ color: token.color, style: "outline" }),
          }}
        >
          <Text text={token.text} />
        </span>
      );
    case "boxedKeyword": {
      return (
        <span className="description-variable">
          <Text text={token.text} />
        </span>
      );
    }
    case "icon": {
      const { imageUrl, tagIcon } = DESCRIPTION_ICON_IMAGES[token.id] ?? {};
      const overrideStyleClass = token.overrideStyle()
        ? `description-${token.overrideStyle()}`
        : "";
      return (
        <>
          {imageUrl && <img className="description-icon" src={imageUrl} />}
          {tagIcon && (
            <span
              className={`description-icon-tag ${overrideStyleClass}`}
              style={{
                "--image": `url("${tagImageUrl(tagIcon)}")`,
              }}
            />
          )}
        </>
      );
    }
    case "reference":
      const overrideStyleClass = token.overrideStyle()
        ? `description-${token.overrideStyle()}`
        : "";
      return (
        <span
          className={`description-token ref-${token.refType} ${overrideStyleClass}`}
          style={{
            "--manual-color": token.manualColor ?? "",
          }}
        >
          <Text text={names.get(token.id) ?? `#${token.id}`} />
        </span>
      );
    case "lineBreak":
      return <br />;
    case "errored":
      return (
        <span className="description-token description-errored">
          {token.text}
        </span>
      );
  }
};
const Description = ({ description }: { description: ParsedDescription }) => {
  return (
    <>
      {description.map((token, i) => (
        <Token token={token} key={i} />
      ))}
    </>
  );
};

const Cost = (props: {
  type: "skill" | "keyword" | "actionCard";
  cost: PlayCost[];
  readonly?: boolean;
}) => {
  const rootClassName = {
    skill: "skill-cost-group",
    keyword: "keyword-cost-group",
    actionCard: "action-card-cost-group",
  }[props.type];
  const diceClassName =
    props.type === "actionCard" ? "action-card-cost-dice" : "dice-icon";
  return (
    <div className={rootClassName}>
      {props.cost.map(({ type, count }, i) => (
        <div className="cost" data-readonly={props.readonly} key={type}>
          <img src={diceImageUrl(type)} className={diceClassName} />
          {type !== "GCG_COST_LEGEND" && (
            <>
              <div className="stroked-text-top">{count}</div>
              <div className="stroked-text-bottom">{count}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const KeywordTag = (props: {
  tag: string;
  image?: string;
  className?: string;
}) => {
  const { language = "zh" } = useAppContext();
  return (
    TYPE_TAG_TEXT_MAP[language][props.tag] && (
      <div className={`keyword-tag ${props.className ?? ""}`}>
        {/* {(props.image || TYPE_TAG_IMG_NAME_MAP[props.tag]) && (
          <div className="keyword-tag-icon-container">
            {props.image ? (
              <img
                className="keyword-tag-image"
                src={cardFaceUrl(props.image)}
              />
            ) : (
              <div
                className="keyword-tag-icon"
                style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
              />
            )}
          </div>
        )} */}
        <div className="keyword-tag-text">
          {TYPE_TAG_TEXT_MAP[language][props.tag]}
        </div>
      </div>
    )
  );
};

const KeywordIcon = (props: {
  id: number;
  tag: string;
  image?: string;
  className?: string;
}) => {
  const { prepareSkillToEntityMap, data } = useAppContext();
  const chooseImage = (props: { id: number; image?: string }) => {
    if (props.image) {
      return cardFaceUrl(props.image);
    } else if (props.id in MISSING_ICONS_URL) {
      return MISSING_ICONS_URL[props.id];
    } else {
      return tagImageUrl("GCG_CARD_EVENT");
    }
  };
  if (props.tag === "GCG_RULE_EXPLANATION") {
    return void 0;
  } else if (prepareSkillToEntityMap.get(props.id)) {
    // 准备技能icon特判
    const prepareState = data.entities.find(
      (e) => e.id === prepareSkillToEntityMap.get(props.id),
    );
    if (prepareState) {
      return (
        <img
          className="buff-icon"
          src={chooseImage({
            id: prepareState.id,
            image: prepareState.buffIcon,
          })}
        ></img>
      );
    } else return void 0;
  } else if (props.tag === "GCG_SKILL_TAG_VEHICLE") {
    // 特技icon特判
    const vehicleCard = data.entities.find(
      (e) => e.id === Number(props.id.toString().slice(0, -1)),
    );
    if (vehicleCard) {
      return (
        <img
          className="buff-icon"
          src={chooseImage({ id: vehicleCard.id, image: vehicleCard.buffIcon })}
        ></img>
      );
    } else {
      return (
        <img
          className="buff-icon"
          src={chooseImage({ id: props.id, image: props.image })}
        ></img>
      );
    }
  } else if (
    [
      "GCG_SKILL_TAG_A",
      "GCG_SKILL_TAG_E",
      "GCG_SKILL_TAG_Q",
      // "GCG_SKILL_TAG_VEHICLE",
    ].includes(props.tag)
  ) {
    // 衍生形态技能icon特判
    return (
      <div
        className="buff-mask"
        style={{
          maskImage: `url("${chooseImage({
            id: props.id,
            image: props.image,
          })}")`,
        }}
      />
    );
  } else {
    return (
      <img
        className="buff-icon"
        src={chooseImage({ id: props.id, image: props.image })}
      ></img>
    );
  }
};

type ChildData =
  | SkillRawData
  | EntityRawData
  | KeywordRawData
  | ActionCardRawData;

const Children = ({ children }: { children: ParsedChild[] }) => {
  const {
    displayId,
    language = "zh",
    prepareSkillToEntityMap,
  } = useAppContext();
  return (
    <div className="child-layout">
      {children.map((keyword) => (
        <div className="keyword-box-wrapper">
          <div className="keyword-line"></div>
          {"cardFace" in keyword && keyword.cardFace && (
            <div className="keyword-card">
              <img
                src={KEYWORD_CARDBACK_BOTTOM}
                className="keyword-card-back-bottom"
              />
              <div
                className="keyword-card-back-repeat"
                style={{ "--image": `url("${KEYWORD_CARDBACK_REPEAT}")` }}
              ></div>
              <img
                src={cardFaceUrl(keyword.cardFace)}
                className="keyword-card-face"
              />
              <img src={KEYWORD_CARD_FRAME} className="keyword-card-frame" />
            </div>
          )}
          <div className="keyword-box">
            <div className="keyword-buff-box">
              {!("cardFace" in keyword && keyword.cardFace) && (
                <KeywordIcon
                  id={keyword.id}
                  tag={
                    "type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"
                  }
                  image={
                    "buffIcon" in keyword
                      ? keyword.buffIcon
                      : "icon" in keyword
                      ? keyword.icon
                      : void 0
                  }
                />
              )}
              <div className="keyword-title-box">
                <div className="keyword-title">
                  <Text text={keyword.name} />
                </div>
                <div className="keyword-tags">
                  <KeywordTag
                    tag={
                      "type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"
                    }
                    image={"buffIcon" in keyword ? keyword.buffIcon : void 0}
                  />
                  {"tags" in keyword &&
                    keyword.tags.map((tag) => (
                      <KeywordTag tag={tag} key={tag} />
                    ))}
                  {prepareSkillToEntityMap.has(keyword.id) && (
                    <KeywordTag tag="GCG_TAG_PREPARE_SKILL" />
                  )}
                  {displayId && (
                    <div className="id-box">
                      <div className="keyword-tag-text">ID: {keyword.id}</div>
                    </div>
                  )}
                  {prepareSkillToEntityMap.has(keyword.id) && displayId && (
                    <div className="id-box">
                      <div className="keyword-tag-text">
                        ID: {prepareSkillToEntityMap.get(keyword.id)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {"playCost" in keyword && (
              <Cost
                type="keyword"
                cost={
                  keyword.playCost.length === 0
                    ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
                    : keyword.playCost
                }
                readonly={
                  COST_READONLY_ENTITIES.includes(keyword.id) ||
                  prepareSkillToEntityMap.has(keyword.id)
                }
              />
            )}
            <div
              className={`keyword-description keyword-description-${language}`}
            >
              <Description description={keyword.parsedDescription} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillBox = ({ skill }: { skill: ParsedSkill }) => {
  const { authorName, displayId, language = "zh" } = useAppContext();
  if (skill.hidden) {
    return null;
  }
  return (
    <div className="skill-box figure" key={skill.id}>
      {/* <div className="author-decorator-top">{AUTHOR_CONFIG.name}</div> */}
      {/* <div className="author-decorator-bottom">{authorName}</div> */}
      <div className="skill-type">
        {TYPE_TAG_TEXT_MAP[language][skill.type]}
      </div>
      {skill.playCost && <Cost type="skill" cost={skill.playCost} />}
      <div
        className="skill-icon"
        style={{
          maskImage: `url("${
            skill.icon
              ? `/images/${skill.icon}.png`
              : MISSING_ICONS_URL[skill.id]
          }")`,
        }}
      ></div>
      <div className="skill-title">
        <Text text={skill.name} />
        {displayId && <span className="id-box">ID: {skill.id}</span>}
      </div>
      <div className={`skill-description skill-description-${language}`}>
        <Description description={skill.parsedDescription} />
      </div>
      {skill.children.length > 0 && <Children children={skill.children} />}
    </div>
  );
};

const CardFace = (props: {
  className?: string;
  isLegend?: boolean;
  cardFace: string;
  children?: React.ReactNode;
}) => {
  const { cardbackImage = "UI_Gcg_CardBack_Fonta_03" } = useAppContext();
  return (
    <div className={`card-face-component ${props.className ?? ""}`}>
      <img src={`/assets/${cardbackImage}.png`} className="card-back" />
      <img src={CARD_BACK_FRAME} className="card-frame-shadow" />
      {/* <!-- 角色牌牌面 --> */}
      <div className="card-face">
        <img src={cardFaceUrl(props.cardFace)} className="card-face-image" />
        <img
          src={props.isLegend ? CARD_LEGEND_FRAME : CARD_NORMAL_FRAME}
          className="card-frame"
        />
        {props.children}
      </div>
    </div>
  );
};

const Character = ({ character }: { character: ParsedCharacter }) => {
  const ctx = useAppContext();
  const { debug, displayStory } = ctx;
  const [normalSkill, ...otherSkills] = character.parsedSkills;
  return (
    <div className="character">
      <div className="character-header">
        <CardFace
          className="character-image-container"
          cardFace={character.cardFace}
        >
          <div className="avatar-card-hp">
            <img src={AVATAR_CARD_HP} className="avatar-card-hp-image" />
            <div className="stroked-text-top">{character.hp}</div>
            <div className="stroked-text-bottom">{character.hp}</div>
          </div>
          <div className="energy-bar">
            {Array.from({
              length:
                character.id in SPECIAL_ENERGY_MAP
                  ? SPECIAL_ENERGY_MAP[character.id].count
                  : character.maxEnergy,
            }).map((_, i) => (
              <img
                src={
                  character.id in SPECIAL_ENERGY_MAP
                    ? SPECIAL_ENERGY_MAP[character.id].type
                    : AVATAR_CARD_ENERGY
                }
                key={i}
                className="energy"
              />
            ))}
          </div>
        </CardFace>
        <div className="character-info">
          <div className="character-title-wrapper">
            <div className="character-title">
              <Text text={character.name} />
            </div>
          </div>
          <div className="character-tags">
            {character.tags.map((tag) => (
              <Tag type="character" tag={tag} key={tag} />
            ))}
          </div>
          <hr className="info-divider" />
          <p className="info-story">
            {displayStory && <Text text={character.storyText} />}
          </p>
          <div className="spacer"></div>
          <SkillBox skill={normalSkill} />
        </div>
      </div>
      {otherSkills.map((skill) => (
        <SkillBox skill={skill} key={skill.id} />
      ))}
    </div>
  );
};

const ActionCard = ({ card }: { card: ParsedActionCard }) => {
  const { authorName, displayId, language = "zh" } = useAppContext();
  return (
    <div className="action-card">
      <div className="action-card-info figure">
        {/* <div className="author-decorator-bottom">{authorName}</div> */}
        <div className="action-card-title">
          <Text text={card.name} />
          {displayId && <span className="id-box">ID: {card.id}</span>}
        </div>
        <div className="action-card-tags">
          <Tag type="cardType" tag={card.type} />
          {card.tags.map((tag) => (
            <Tag type="cardTag" tag={tag} key={tag} />
          ))}
        </div>
        <div className="dashed-line" />
        <div
          className={`action-card-description action-card-description-${language}`}
        >
          <Description description={card.parsedDescription} />
        </div>
        {card.children.length > 0 && <Children children={card.children} />}
      </div>
      <CardFace
        isLegend={card.tags.includes("GCG_TAG_LEGEND")}
        className="action-card-image-container"
        cardFace={card.cardFace}
      >
        <Cost
          type="actionCard"
          cost={
            card.playCost.length === 0
              ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
              : card.playCost.length === 1 &&
                card.playCost[0].type === "GCG_COST_LEGEND"
              ? [{ type: "GCG_COST_DICE_SAME", count: 0 }, ...card.playCost]
              : card.playCost
          }
        />
      </CardFace>
    </div>
  );
};

const PageTitle = (props: { text: string }) => {
  return (
    <div className="page-title-wrapper">
      <img className="page-title-icon" src={PAGE_TITLE_ICON} />
      <div className="page-title">
        <Text text={props.text} />
      </div>
      <div className="page-title-tail">
        <svg width="80" height="192">
          <polyline
            points="0,37.2 8,37.2 69,96 8,156 0,156"
            fill="#f7f7ebbb"
            stroke="#ded3c3ff"
            strokeWidth="6"
          />
        </svg>
      </div>
    </div>
  );
};

const AppImpl = (props: AppProps) => {
  const ctx = useAppContext();
  const { language = "zh", data } = ctx;
  ctx.supIds = [];
  if (props.version) {
    let versionStr: string = props.version;
    if (versionStr.startsWith("v")) {
      versionStr = versionStr.slice(1);
    }
    if (versionStr.endsWith("-beta")) {
      versionStr = versionStr.slice(0, -5);
    }
    const [major, minor, patch] = versionStr.split(".");
    const isBeta = Number(patch) >= 50;
    const mainVersionText = isBeta
      ? `${major}.${Number(minor) + 1}`
      : `${major}.${minor}`;
    const versionText = isBeta
      ? ` Beta ${mainVersionText} v${Number(patch) - 49}`
      : mainVersionText;

    const pageTitle = {
      zh: `${mainVersionText}版本新增行动牌`,
      en: `Action Cards added in ${mainVersionText}`,
    };
    const shownCharacters = data.characters.filter(
      (ch) => ch.sinceVersion === props.version,
    );
    const shownActionCards = data.actionCards.filter(
      (ac) =>
        ac.sinceVersion === props.version &&
        ac.obtainable &&
        !ac.tags.includes("GCG_TAG_TALENT"),
    );
    const charactersParsed = shownCharacters.map((c) => {
      const character = parseCharacter(ctx, c);
      const talentRaw = data.actionCards.find(
        (ac) => ac.relatedCharacterId === character.id,
      );
      return {
        character,
        talent: talentRaw ? parseActionCard(ctx, talentRaw) : null,
      };
    });
    const actionCardsParsed = shownActionCards.map((c) =>
      parseActionCard(ctx, c),
    );
    return (
      <>
        {charactersParsed.map(({ character, talent }) => (
          <div className="layout" key={character.id}>
            <Character character={character} />
            {talent && <ActionCard card={talent} />}
          </div>
        ))}
        <div className={`layout ${props.mirroredLayout ? "flip" : ""}`}>
          <PageTitle text={pageTitle[language]} />
          {actionCardsParsed.map((c) => (
            <ActionCard card={c} />
          ))}
          <div className="version-layout">
            <div className="version-text">{versionText}</div>
            <img src={props.authorImageUrl} className="logo" />
          </div>
        </div>
      </>
    );
  }
  if (props.solo) {
    const type = props.solo[0];
    const id = Number(props.solo.slice(1));
    if (type === "A") {
      const character = data.characters.find((c) => c.id === id);
      if (character) {
        const talent = data.actionCards.find(
          (ac) => ac.relatedCharacterId === character.id,
        );
        return (
          <div className="layout">
            <Character character={parseCharacter(ctx, character)} />
            {talent && <ActionCard card={parseActionCard(ctx, talent)} />}
            <div className="version-layout">
              <div className="version-text">{props.authorName}</div>
              {props.authorImageUrl ? (
                <img src={props.authorImageUrl} className="logo" />
              ) : (
                <div />
              )}
            </div>
          </div>
        );
      }
    } else if (type === "C") {
      const actionCard = data.actionCards.find((c) => c.id === id);
      if (actionCard) {
        return (
          <div
            className="layout"
            style={{
              paddingTop: `0rem`,
              backgroundImage: `url("assets/frame/header_decor_onecard.png")`,
            }}
          >
            <ActionCard card={parseActionCard(ctx, actionCard)} />
            <div className="version-layout">
              <div className="version-text">{props.authorName}</div>
              {props.authorImageUrl ? (
                <img src={props.authorImageUrl} className="logo" />
              ) : (
                <div />
              )}
            </div>
          </div>
        );
      }
    }
  }
  return <></>;
};

const App = () => {
  const [appConfig, setAppConfig] = useState<AppProps>(APP_CONFIG);
  const [rawData, setRawData] = useState<Record<string, any>>({
    characters: [],
    actionCards: [],
    entities: [],
    keywords: [],
  });
  useEffect(() => {
    for (const category of [
      "characters",
      "actionCards",
      "entities",
      "keywords",
    ]) {
      const filename = category === "actionCards" ? "action_cards" : category;
      const param = new URLSearchParams({
        beta: beta ? "1" : "",
        remote: appConfig.localData ? "" : "1",
      });
      let url = `/data/${appConfig.language || "zh"}/${filename}.json?${param}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setRawData((prev) => ({
            ...prev,
            [category]: data,
          }));
        });
    }
  }, [appConfig.localData, appConfig.language]);

  const skills = [...rawData.characters, ...rawData.entities].flatMap(
    (e) => e.skills as SkillRawData[],
  );
  const genericEntities = [...rawData.actionCards, ...rawData.entities];
  const data = {
    ...rawData,
    genericEntities,
    skills,
  } as AppContextValue["data"];
  const supIds: number[] = [];
  const names = new Map<number, string>(
    [...genericEntities, ...rawData.characters, ...skills].map(
      (e) => [e.id, e.name] as const,
    ),
  );
  const keywordToEntityMap = new Map(
    data.keywords
      .filter((k) => k.name && k.id > 1000)
      .map((k) => {
        const match = genericEntities.find(
          (e) =>
            e.name === k.name &&
            e.id > 110000 &&
            !(e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"),
        );
        return match ? [k.id, match.id] : null;
      })
      .filter((pair): pair is [number, number] => !!pair),
  );
  const prepareSkillToEntityMap = new Map(
    data.entities
      .filter((e) => (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"))
      .flatMap((entity) => {
        const matches = [
          ...entity.rawDescription.matchAll(/\$\[S(\d{5}|\d{7})\]/g),
        ];
        return matches.map((m) => [parseInt(m[1], 10), entity.id]);
      }),
  );

  return (
    <AppContext.Provider
      value={{
        ...appConfig,
        data,
        names,
        supIds,
        keywordToEntityMap,
        prepareSkillToEntityMap,
      }}
    >
      <AppImpl {...appConfig} />
    </AppContext.Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
