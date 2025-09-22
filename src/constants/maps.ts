// 常量与映射，从原 App.tsx 抽取
export const MISSING_ICONS_URL: Record<number, string> = {
  15122: '/images/Skill_S_Lanyan_01.png',
  15123: '/images/Skill_E_Lanyan_01_HD.png',
  115121: '/images/UI_Gcg_Buff_Lanyan_E1.png',
  15132: '/images/Skill_S_Heizo_01.png',
  15133: '/images/Skill_E_Heizo_01_HD.png',
  15134: '/images/UI_Talent_S_Heizo_05.png',
  115132: '/images/UI_Gcg_Buff_Heizo_E1.png',
  115133: '/images/UI_Gcg_DeBuff_Heizo_S.png',
  115134: '/images/UI_Gcg_DeBuff_Heizo_S.png',
  115135: '/images/UI_Gcg_DeBuff_Heizo_S.png',
  115136: '/images/UI_Gcg_DeBuff_Heizo_S.png',
  27042: '/images/MonsterSkill_S_HookwalkerPrimo_01.png',
  27043: '/images/MonsterSkill_E_HookwalkerPrimo_01_HD.png',
  27044: '/images/MonsterSkill_S_HookwalkerPrimo_02.png',
};

export const CHILDREN_CONFIG: Record<number, string> = {
  11142: '$[C111141],$[C111142],$[C111143]',
  12082: '$[C112081],$[C112082]',
  12102: '$[C112101],$[S12104]',
  12111: '_',
  12142: '$[C112142],$[S1121422],$[C112143],$[C112141]',
  13141: '_',
  13152: '$[C113151],$[C113154],$[S1131541],$[C113155],$[S1131551],$[C113156],$[S1131561],$[S13155]',
  14091: '_',
  14092: '$[C114091]',
  14121: '_',
  15114: '$[C115113],$[C115114],$[C115115],$[C115116],$[C115117]',
  15133: '$[C115133],$[C115134],$[C115135],$[C115136]',
  16063: '$[C116062]',
  16092: '$[C116091],$[C116092],$[C116093],$[C116095],$[C116096]',
  216091: '$[C116094]',
  16111: '_',
  16113: '_',
  17082: '$[C117082]',
  21022: '$[C121022]',
  21023: '_',
  21024: '$[C121021],$[K1013],$[S63011],$[S63012],$[S63013],$[C163011]',
  221031: '$[C121022]',
  22012: '$[C122011],$[C122012],$[C122013]',
  22013: '_',
  22052: '_',
  22053: '$[C122051],$[S1220511],$[S1220512]$[C122052]',
  23032: '$[C123032]',
  27032: '$[C127033]',
  322027: '$[C302206],$[C302207],$[C302208],$[C302209],$[C302210],$[C302211],$[C302212],$[C302213],$[C302214],$[C302215]',
  331702: '_',
  332016: '$[C303216],$[C303217],$[C303218],$[C303219]',
  332032: '$[C332033],$[C332034],$[C332035]',
  333020: '$[C333021],$[C333022],$[C333023],$[C333024],$[C333025],$[C333026]',
  333027: '_',
};

export const SHOWN_KEYWORDS = [1012, 1013];
export const COST_READONLY_ENTITIES = [112131,112132,112133,112142,115112,116102,116112,333021,333022,333023,333024,333025,333026];

export const correctId: Record<number, number> = { 12123: 12112 };

export const CARD_BACK_FRAME = '/assets/frame/avatar_card_frame_2.png';
export const CARD_NORMAL_FRAME = '/assets/frame/card_frame_normal.png';
export const CARD_LEGEND_FRAME = '/assets/frame/card_frame_legend.png';
export const AVATAR_CARD_HP = '/assets/frame/UI_TeyvatCard_LifeBg.png';
export const AVATAR_CARD_ENERGY = '/assets/frame/UI_TeyvatCard_LifeBg3.png';
export const KEYWORD_CARD_FRAME = '/assets/frame/keyword_card_frame.png';
export const KEYWORD_CARDBACK_REPEAT = '/assets/frame/UI_Gcg_CardBack_Repeat.png';
export const KEYWORD_CARDBACK_BOTTOM = '/assets/frame/UI_Gcg_CardBack_Bottom.png';
export const PAGE_TITLE_ICON = '/assets/frame/pagetitle.png';

export const SPECIAL_ENERGY_MAP: Record<number, { type: string; count: number }> = {
  1315: { type: '/assets/frame/UI_TeyvatCard_LifeBg_Mavuika1.png', count: 3 },
};

export const COST_TYPE_IMG_NAME_MAP: Record<string,string> = {
  GCG_COST_DICE_VOID: 'Diff',
  GCG_COST_DICE_CRYO: 'Ice',
  GCG_COST_DICE_HYDRO: 'Water',
  GCG_COST_DICE_PYRO: 'Fire',
  GCG_COST_DICE_ELECTRO: 'Electric',
  GCG_COST_DICE_ANEMO: 'Wind',
  GCG_COST_DICE_GEO: 'Rock',
  GCG_COST_DICE_DENDRO: 'Grass',
  GCG_COST_DICE_SAME: 'Same',
  GCG_COST_ENERGY: 'Energy',
  GCG_COST_LEGEND: 'Legend',
  GCG_COST_SPECIAL_ENERGY: 'Energy_Mavuika',
};

export const TYPE_TAG_TEXT_MAP: Record<string, Record<string,string>> = { /* 仅保留与 UI 相关的映射，详见原文件 */
  zh: { GCG_RULE_EXPLANATION: '规则解释', GCG_SKILL_TAG_A: '普通攻击', GCG_SKILL_TAG_E: '元素战技', GCG_SKILL_TAG_Q: '元素爆发', GCG_SKILL_TAG_PASSIVE: '被动技能', GCG_SKILL_TAG_VEHICLE: '特技', GCG_CARD_EVENT: '事件牌', GCG_CARD_ONSTAGE: '出战状态', GCG_CARD_STATE: '状态', GCG_CARD_SUMMON: '召唤物', GCG_CARD_ASSIST: '支援牌', GCG_CARD_MODIFY: '装备牌', GCG_TAG_ELEMENT_HYDRO: '水元素' },
  en: { GCG_RULE_EXPLANATION: 'Detailed Rules', GCG_SKILL_TAG_A: 'Normal Attack', GCG_SKILL_TAG_E: 'Elemental Skill', GCG_SKILL_TAG_Q: 'Elemental Burst', GCG_SKILL_TAG_PASSIVE: 'Passive Skill', GCG_SKILL_TAG_VEHICLE: 'Technique', GCG_CARD_EVENT: 'Event Card', GCG_CARD_ONSTAGE: 'Combat Status', GCG_CARD_STATE: 'Status', GCG_CARD_SUMMON: 'Summon', GCG_CARD_ASSIST: 'Support Card', GCG_CARD_MODIFY: 'Equipment Card', GCG_TAG_ELEMENT_HYDRO: 'Hydro' }
};

export const TYPE_TAG_IMG_NAME_MAP: Record<string,string> = {
  GCG_CARD_EVENT: 'Custom_ActionCard',
  GCG_CARD_ONSTAGE: 'Custom_Summon',
  GCG_CARD_STATE: 'Custom_Summon',
  GCG_CARD_SUMMON: 'Custom_Summon',
  GCG_CARD_ASSIST: 'Custom_ActionCard',
  GCG_CARD_MODIFY: 'Custom_ActionCard',
  GCG_TAG_ELEMENT_HYDRO: 'Element_Water'
};

export const DESCRIPTION_ICON_IMAGES = {
  2102: { imageUrl: '/assets/UI_Gcg_Keyword_Element_Water.png' },
  1102: { imageUrl: '/assets/UI_Gcg_DiceL_Water.png' }
} as Record<number,{imageUrl?:string;tagIcon?:string}>;

export const KEYWORD_COLORS: Record<number,string> = { 100:'#d9b253',101:'#63bacd',102:'#488ccb'};

export const DAMAGE_KEYWORD_MAP: Record<string,number> = {
  GCG_ELEMENT_PHYSIC:100,
  GCG_ELEMENT_CRYO:101,
  GCG_ELEMENT_HYDRO:102
};

export const BOLD_COLOR = '#FFFFFFFF';
