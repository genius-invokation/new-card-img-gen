// This is mock data. In a real application, you would fetch this from an API.

import type { ActionCardRawData, CharacterRawData, KeywordRawData } from "@gi-tcg/static-data";

export const MOCK_CHARACTER: CharacterRawData = {
  id: 1211,
  name: "芙宁娜",
  englishName: "Furina",
  icon: "UI_Gcg_CardFace_Char_Avatar_Furina",
  hp: 10,
  maxEnergy: 2,
  obtainable: true,
  cardFace: "UI_Gcg_CardFace_Char_Avatar_Furina_Card",
  storyText: "「在审判的舞台上，唯有『水之神』芙卡洛斯才能受人瞩目。至于我…唉，还是让我先好好享受这场演出吧。」",
  tags: ["GCG_TAG_ELEMENT_HYDRO", "GCG_TAG_NATION_FONTAINE", "GCG_TAG_ARKHE_PNEUMA", "GCG_TAG_ARKHE_OUSIA"],
  skills: [
    {
      id: 12111,
      name: "独舞之邀",
      englishName: "Solo Invitation",
      type: "GCG_SKILL_TAG_A",
      rawDescription: "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]。",
      description: "造成2点物理伤害。",
      keyMap: {
        D__KEY__DAMAGE: "2",
        D__KEY__ELEMENT: "GCG_ELEMENT_PHYSIC"
      },
      hidden: false,
      playCost: [
        { type: "GCG_COST_DICE_HYDRO", count: 1 },
        { type: "GCG_COST_DICE_VOID", count: 2 },
      ],
      targetList: [],
    },
    {
      id: 12112,
      name: "沙龙独唱",
      englishName: "Salon Solitaire",
      type: "GCG_SKILL_TAG_E",
      rawDescription: "召唤<color=#FFFFFFFF>$[C112111]</color>或<color=#FFFFFFFF>$[C112112]</color>。（只能召唤一种）\\n<color=#FFFFFFFF>始基力</color>：此角色具有<color=#FFFFFFFF>「始基力：荒性」</color>时，召唤<color=#FFFFFFFF>$[C112111]</color>。\\n此角色具有<color=#FFFFFFFF>「始基力：芒性」</color>时，召唤<color=#FFFFFFFF>$[C112112]</color>。",
      description: "召唤众水的歌者或沙龙的客人。（只能召唤一种）\n始基力：此角色具有「始基力：荒性」时，召唤众水的歌者。\n此角色具有「始基力：芒性」时，召唤沙龙的客人。",
      keyMap: {},
      hidden: false,
      playCost: [
        { type: "GCG_COST_DICE_HYDRO", count: 3 },
      ],
      targetList: [],
    },
    {
      id: 12113,
      name: "万众狂欢",
      englishName: "Let the People Rejoice",
      type: "GCG_SKILL_TAG_Q",
      rawDescription: "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]，所有我方角色附属<color=#FFFFFFFF>$[C112113]</color>。",
      description: "造成2点水元素伤害，所有我方角色附属万众狂欢。",
      keyMap: {
        D__KEY__DAMAGE: "2",
        D__KEY__ELEMENT: "GCG_ELEMENT_HYDRO"
      },
      hidden: false,
      playCost: [
        { type: "GCG_COST_DICE_HYDRO", count: 3 },
        { type: "GCG_COST_ENERGY", count: 2 },
      ],
      targetList: [],
    },
  ],
};

export const MOCK_ACTION_CARD: ActionCardRawData = {
  id: 332032,
  name: "幻戏倒计时",
  englishName: "Countdown to the Climax",
  type: "GCG_CARD_EVENT",
  cardFace: "UI_Gcg_Card_Event_Event_Countdown",
  rawDescription: "我方出战角色附属<color=#FFFFFFFF>$[C332033]</color>。",
  description: "我方出战角色附属倒计时。",
  playCost: [
    { type: "GCG_COST_DICE_SAME", count: 1 },
  ],
  tags: [],
  obtainable: true,
  targetList: [],
  relatedCharacterId: null,
  relatedCharacterTags: [],
};

export const MOCK_NAMES = new Map<number, string>([
  [1211, "芙宁娜"],
  [12111, "独舞之邀"],
  [12112, "沙龙独唱"],
  [12113, "万众狂欢"],
  [112111, "众水的歌者"],
  [112112, "沙龙的客人"],
  [112113, "万众狂欢"],
  [332032, "幻戏倒计时"],
  [332033, "倒计时"],
]);

export const MOCK_DATA = {
  characters: [MOCK_CHARACTER],
  actionCards: [MOCK_ACTION_CARD],
  entities: [],
  keywords: [
    { id: 100, name: "物理伤害", rawName: "物理伤害", rawDescription: "", description: "" },
    { id: 102, name: "水元素伤害", rawName: "水元素伤害", rawDescription: "", description: "" },
  ] as KeywordRawData[],
};
