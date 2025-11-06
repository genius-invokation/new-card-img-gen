import type {
  Language,
  CharacterRawData,
  SkillRawData,
  EntityRawData,
  ActionCardRawData,
} from "./types";

export const CHILDREN_CONFIG: Record<number, string> = {
  11154: "$[C111159],$[C111152],$[C111153],$[C111154],$[C111155]", // 爱可菲 P
  12082: "$[C112081],$[C112082]", // 妮露 E
  12111: "_", // 芙宁娜 A  // 置空不能空着，随便写点啥，下同
  12142: "$[C112142],$[S1121422],$[C112143],$[C112141]", // 玛拉妮 E
  13141: "_", // 阿蕾奇诺 A
  13152:
    "$[C113151],$[C113154],$[S1131541],$[C113155],$[S1131551],$[C113156],$[S1131561],$[S13155]", // 玛薇卡 E
  14091: "_", // 丽莎 A
  14092: "$[C114091]", // 丽莎 E
  14121: "_", // 克洛琳德 A
  14151: "_", // 瓦雷莎 A
  15114: "$[C115113],$[C115114],$[C115115],$[C115116],$[C115117]", // 恰斯卡 P
  15133: "$[C115133],$[C115134],$[C115135],$[C115136]", // 鹿野院 Q
  15153: "$[C115153],$[C115154],$[C115155],$[C115156]", // 伊法 Q
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
  23053: "_", // 火龙王 Q
  27032: "$[C127033]", // 草镀金旅团 E
  322027:
    "$[C302206],$[C302207],$[C302208],$[C302209],$[C302210],$[C302211],$[C302212],$[C302213],$[C302214],$[C302215]", // 瑟琳
  330012: "$[C300008],$[C300009]", // 沙中遗事
  331702: "_", // 草共鸣
  332016: "$[C303216],$[C303217],$[C303218],$[C303219]", // 愚人众的阴谋
  332032: "$[C332033],$[C332034],$[C332035]", // 幻戏倒计时
  333020: "$[C333021],$[C333022],$[C333023],$[C333024],$[C333025],$[C333026]", // 奇瑰之汤
  333027: "_", // 纵声欢唱
} as Record<number, string>;

// 需要展示的规则解释ID
export const SHOWN_KEYWORDS = [
  1012, // 汲取对应元素的力量
  1013, // 「焚尽的炽炎魔女」
  7, // 距离我方出战角色最近的角色
  66, // 冒险
];

export const COST_READONLY_ENTITIES = [
  112131, 112132, 112133, 112142, 115112, 115152, 116102, 116112, 333021,
  333022, 333023, 333024, 333025, 333026, 300008, 300009,
];

export const CARD_BACK_FRAME = `${
  import.meta.env.BASE_URL
}assets/frame/avatar_card_frame_2.png`;
export const CARD_NORMAL_FRAME = `${
  import.meta.env.BASE_URL
}assets/frame/card_frame_normal.png`;
export const CARD_LEGEND_FRAME = `${
  import.meta.env.BASE_URL
}assets/frame/card_frame_legend.png`;
export const KEYWORD_CARD_FRAME = `${
  import.meta.env.BASE_URL
}assets/frame/keyword_card_frame.png`;
export const KEYWORD_CARDBACK_REPEAT = `${
  import.meta.env.BASE_URL
}assets/frame/card_back_repeat.png`;
export const KEYWORD_CARDBACK_BOTTOM = `${
  import.meta.env.BASE_URL
}assets/frame/card_back_bottom.png`;
export const PAGE_TITLE_ICON = `${
  import.meta.env.BASE_URL
}assets/frame/pagetitle.png`;

export const AVATAR_CARD_HP = `${
  import.meta.env.BASE_URL
}assets/UI_TeyvatCard_LifeBg.png`;
export const AVATAR_CARD_ENERGY = `${
  import.meta.env.BASE_URL
}assets/UI_TeyvatCard_LifeBg3.png`;
export const SPECIAL_ENERGY_MAP: Record<
  number,
  { type: string; count: number }
> = {
  1315: {
    type: `${import.meta.env.BASE_URL}assets/UI_TeyvatCard_LifeBg_Mavuika1.png`,
    count: 3,
  },
};

export const COST_TYPE_IMG_NAME_MAP: Record<string, string> = {
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
};

export const TYPE_TAG_TEXT_MAP: Record<Language, Record<string, string>> = {
  CHS: {
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
    GCG_TAG_ADVENTURE_PLACE: "冒险地点",
  },
  EN: {
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
    GCG_TAG_NATION_SIMULANKA: "Simulanka",
    GCG_TAG_ADVENTURE_PLACE: "Adventure Spot",
  },
};

export const TYPE_TAG_IMG_NAME_MAP: Record<string, string> = {
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
  GCG_TAG_NATION_SIMULANKA: "Card_Simulanka", // ###非官方###
  GCG_TAG_ADVENTURE_PLACE: "Card_Adventure", // ###非官方###
};

export const ELEMENT_TAG_TO_KEYWORD_ID: Record<string, number> = {
  GCG_TAG_ELEMENT_CRYO: 301,
  GCG_TAG_ELEMENT_HYDRO: 302,
  GCG_TAG_ELEMENT_PYRO: 303,
  GCG_TAG_ELEMENT_ELECTRO: 304,
  GCG_TAG_ELEMENT_ANEMO: 305,
  GCG_TAG_ELEMENT_GEO: 306,
  GCG_TAG_ELEMENT_DENDRO: 307,
};

export const DESCRIPTION_ICON_IMAGES = {
  4007: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Shield.png`,
  },
  2100: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Physics.png`,
  },
  2101: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Ice.png`,
  },
  2102: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Water.png`,
  },
  2103: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Fire.png`,
  },
  2104: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Electric.png`,
  },
  2105: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Wind.png`,
  },
  2106: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Rock.png`,
  },
  2107: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Element_Grass.png`,
  },
  1101: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Ice.png` },
  1102: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Water.png`,
  },
  1103: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Fire.png` },
  1104: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Elec.png` },
  1105: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Wind.png` },
  1106: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Rock.png` },
  1107: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Grass.png`,
  },
  1108: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Same.png` },
  1109: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Diff.png` },
  1110: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Energy.png`,
  },
  1111: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_DiceL_Any.png` },
  1112: {
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Legend.png`,
  },
  4008: {
    //  ###非官方###
    imageUrl: `${
      import.meta.env.BASE_URL
    }assets/UI_Gcg_Keyword_Fighting_Spirit.png`,
  },
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
  3901: { tagIcon: "GCG_TAG_ADVENTURE_PLACE" }, //  ###非官方###
} as Record<number, { imageUrl?: string; tagIcon?: string }>;

export const KEYWORD_COLORS: Record<number, string> = {
  // 充能
  310: "#d8b456",

  // 伤害
  100: "#d9b253",
  101: "#63bacd",
  102: "#488ccb",
  103: "#d6684b",
  104: "#917ce8",
  105: "#5ca8a6",
  106: "#d29d5d",
  107: "#88b750",

  // 自走棋伤害
  // 150: "#d9b253",
  // 151: "#63bacd",
  // 152: "#488ccb",
  // 153: "#d6684b",
  // 154: "#917ce8",
  // 155: "#5ca8a6",
  // 156: "#d29d5d",
  // 157: "#88b750",

  // 附着
  201: "#63bacd",
  202: "#488ccb",
  203: "#d6684b",
  204: "#917ce8",
  // 205: "#5ca8a6",
  // 206: "#d29d5d",
  207: "#88b750",

  // 元素相关反应
  211: "#63bacd",
  212: "#488ccb",
  213: "#d6684b",
  214: "#917ce8",
  215: "#5ca8a6",
  216: "#d29d5d",
  217: "#88b750",

  // 自走棋元素相关反应
  // 261: "#63bacd",
  // 262: "#488ccb",
  // 263: "#d6684b",
  // 264: "#917ce8",
  // 265: "#5ca8a6",
  // 266: "#d29d5d",
  // 267: "#88b750",

  // 元素骰子
  301: "#63bacd",
  302: "#488ccb",
  303: "#d6684b",
  304: "#917ce8",
  305: "#5ca8a6",
  306: "#d29d5d",
  307: "#88b750",
};

export const DAMAGE_KEYWORD_MAP: Record<string, number> = {
  GCG_ELEMENT_PHYSIC: 100,
  GCG_ELEMENT_CRYO: 101,
  GCG_ELEMENT_HYDRO: 102,
  GCG_ELEMENT_PYRO: 103,
  GCG_ELEMENT_ELECTRO: 104,
  GCG_ELEMENT_ANEMO: 105,
  GCG_ELEMENT_GEO: 106,
  GCG_ELEMENT_DENDRO: 107,
};

export const BOLD_COLOR = "#FFFFFFFF";

export const ADJUSTMENT_SUBJECT_LABELS: Record<Language, Record<string, string>> = {
  CHS: {
    self: "自身",
    normalAttack: "普通攻击",
    elementalSkill: "元素战技",
    elementalBurst: "元素爆发",
    passiveSkill: "被动技能",
    prepareSkill: "准备技能",
    talent: "天赋牌",
    technique: "特技",
    techniqueCard: "特技牌",
    summon: "召唤物",
    status: "状态",
    combatStatus: "出战状态",
    relatedCard: "衍生卡牌",
  },
  EN: {
    self: "Self",
    normalAttack: "Normal Attack",
    elementalSkill: "Elemental Skill",
    elementalBurst: "Elemental Burst",
    passiveSkill: "Passive Skill",
    prepareSkill: "Prepare Skill",
    talent: "Talent Card",
    technique: "Technique",
    techniqueCard: "Technique Card",
    summon: "Summon",
    status: "Status",
    combatStatus: "Combat Status",
    relatedCard: "Related Card",
  },
};

export const ADJUSTMENT_TYPE_LABELS: Record<Language, Record<string, string>> = {
  CHS: {
    hp: "初始最大生命值",
    cost: "所需元素骰费用",
    effect: "效果",
    damage: "伤害",
    usage: "可用次数",
    duration: "持续回合",
  },
  EN: {
    hp: "Initial Max HP",
    cost: "Elemental Dice cost",
    effect: "Effect",
    damage: "DMG",
    usage: "Usage(s)",
    duration: "Duration",
  },
};

export const VERSION_REPLACE_STRS: Record<string, Record<Language, string>> = {
  "6.0": {
    CHS: "「月之一」",
    EN: "Luna I",
  },
  "6.1": {
    CHS: "「月之二」",
    EN: "Luna II",
  },
  "6.2": {
    CHS: "「月之三」",
    EN: "Luna III",
  },
  "6.3": {
    CHS: "「月之四」",
    EN: "Luna IV",
  },
};

// 覆盖数据 - 用于部分更新现有数据
export const overrideCharacterData: Partial<
  Omit<CharacterRawData, "skills"> & {
    skills: Partial<SkillRawData>[];
  }
>[] = [
  {
    id: 1315, // 玛薇卡
    skills: [
      {
        id: 13153, // 玛薇卡 Q 技能描述增加战意图标 ###非官方###
        rawDescription:
          "本角色进入<color=#FFFFFFFF>$[C113151]</color>，获得1点<color=#FFFFFFFF>「夜魂值」</color>，消耗自身全部<color=#D8B456FF>{SPRITE_PRESET#4008}战意</color>，对敌方前台造成等同于消耗战意数量的$[D__KEY__ELEMENT]。\\n若消耗了6点<color=#D8B456FF>{SPRITE_PRESET#4008}战意</color>，则自身附属<color=#FFFFFFFF>$[C113152]</color>。",
      },
      {
        id: 13154, // 玛薇卡 P 技能描述增加战意图标 ###非官方###
        rawDescription:
          "角色不会获得$[K310]。\\n在我方消耗<color=#FFFFFFFF>「夜魂值」</color>或使用「普通攻击」后，获得1点<color=#D8B456FF>{SPRITE_PRESET#4008}战意</color>。\\n本角色使用<color=#FFFFFFFF>元素战技</color>或<color=#FFFFFFFF>元素爆发</color>时，附属<color=#FFFFFFFF>$[C113153]</color>。",
      },
    ],
  },
];

export const overrideEntityData: Partial<EntityRawData>[] = [];

export const overrideActionCardData: Partial<ActionCardRawData>[] = [
  {
    id: 212111, // 芙宁娜天赋 id纠错
    rawDescription:
      "$[K1]：我方出战角色为<color=#FFFFFFFF>$[A1211]</color>时，装备此牌。\\n$[A1211]装备此牌后，立刻使用一次<color=#FFD780FF>$[S12112]</color>。\\n装备有此牌的$[A1211]使用<color=#FFFFFFFF>$[S12112]</color>时，会对自身附属<color=#FFFFFFFF>$[K1030]</color>。（角色普通攻击时根据形态触发不同效果）\\n（牌组中包含$[A1211]，才能加入牌组）",
  },
  {
    id: 300008, // 驱逐灾厄 沙中遗事挑选卡 不可获得 ###可能会在未来修复###
    obtainable: false,
  },
  {
    id: 300009, // 肃净污染 沙中遗事挑选卡 不可获得 ###可能会在未来修复###
    obtainable: false,
  },
  {
    id: 321032, // 沉玉谷 冒险地点 方便查询修改获得属性 描述补偿 ###非官方### 修正一处标点样式 ###可能会在未来修复###
    obtainable: true,
    rawDescription: "<color=#FFFFFFFF>冒险经历达到2时：</color>生成2张手牌<color=#FFFFFFFF>$[K1040]</color>。\\n<color=#FFFFFFFF>冒险经历达到4时：</color>我方获得3层<color=#FFFFFFFF>$[K1041]</color>和<color=#FFFFFFFF>$[K1042]</color>。\\n<color=#FFFFFFFF>冒险经历达到7时：</color>我方全体角色$[K202]，治疗我方受伤最多的角色至最大生命值，并使其获得2点最大生命值，然后弃置此牌。\\n（「{SPRITE_PRESET#3901}冒险地点」只能通过冒险生成，无法加入牌组）",
  },
  {
    id: 321033, // 自身自体之塔 冒险地点 方便查询修改获得属性 描述补偿 ###非官方###
    obtainable: true,
    rawDescription: "<color=#FFFFFFFF>入场时：</color>对我方所有角色造成1点$[K5]。\\n<color=#FFFFFFFF>冒险经历达到偶数次时：</color>生成1个随机基础元素骰。\\n<color=#FFFFFFFF>冒险经历达到5时：</color>生成手牌<color=#FFFFFFFF>$[C301038]</color>。\\n<color=#FFFFFFFF>冒险经历达到12时：</color>生成手牌<color=#FFFFFFFF>$[C301039]</color>。\\n（「{SPRITE_PRESET#3901}冒险地点」只能通过冒险生成，无法加入牌组）",
  },
];
