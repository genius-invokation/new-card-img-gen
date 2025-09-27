import type {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  PlayCost,
  SkillRawData,
} from "@gi-tcg/static-data";
import type { Accessor } from "solid-js";

type AllRawDataImpl = typeof import("@gi-tcg/static-data");
export interface AllRawData extends AllRawDataImpl {}

export type Language = "en" | "zh";

export interface AppConfig {
  language: Language;
  authorName?: string;
  authorImageUrl?: string;
  data: AllRawData;
  version?: `v${number}.${number}.${number}${"" | `-beta`}`;
  solo?: `${"C" | "A"}${number}`;
  mirroredLayout?: boolean;
  cardbackImage: string;
  displayId?: boolean;
  displayStory?: boolean;
}

export interface ParsedCharacter extends CharacterRawData {
  parsedSkills: ParsedSkill[];
}
export interface ParsedSkill extends SkillRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
export interface ParsedEntity extends EntityRawData {
  parsedDescription: ParsedDescription;
}
export interface ParsedActionCard extends ActionCardRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
export interface ParsedKeyword extends KeywordRawData {
  parsedDescription: ParsedDescription;
}
export type ParsedChild =
  | ParsedSkill
  | ParsedEntity
  | ParsedActionCard
  | ParsedKeyword;

export type TokenStyle = "strong" | "light" | "dimmed";
export type DescriptionToken =
  | {
      type: "plain";
      text: string;
      style: () => TokenStyle | "normal";
      color?: string;
    }
  | { type: "boxedKeyword"; text: string }
  | { type: "hiddenKeyword"; id: number }
  | {
      type: "reference";
      refType: string;
      id: number;
      overrideStyle: () => TokenStyle | undefined;
      manualColor?: string;
    }
  | { type: "errored"; text: string }
  | { type: "lineBreak" }
  | { type: "icon"; id: number; overrideStyle: () => TokenStyle | undefined };
export type ParsedDescription = DescriptionToken[];

export interface GlobalSettingsValue {
  language: Accessor<"en" | "zh">;
  cardbackImage: Accessor<string>;
  displayId: Accessor<boolean>;
  displayStory: Accessor<boolean>;
}

export interface RenderContext {
  // characters: CharacterRawData[];
  skills: SkillRawData[];
  keywords: KeywordRawData[];
  genericEntities: (EntityRawData | ActionCardRawData)[];
  /** suppressed IDs */
  supIds: number[];
  names: Map<number, string>;
  keywordToEntityMap: Map<number, EntityRawData>;
  prepareSkillToEntityMap: Map<number, EntityRawData>;
}

export type {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  PlayCost,
  SkillRawData,
};
