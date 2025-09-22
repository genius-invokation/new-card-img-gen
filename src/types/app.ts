import type { ActionCardRawData, CharacterRawData, EntityRawData, KeywordRawData, PlayCost, SkillRawData } from '@gi-tcg/static-data';

export interface AppProps {
  language?: 'en' | 'zh';
  localData?: boolean;
  beta?: boolean;
  authorName?: string;
  authorImageUrl?: string;
  version?: `v${number}.${number}.${number}${'' | `-beta`}`;
  solo?: `${'C' | 'A'}${number}`;
  mirroredLayout?: boolean;
  cardbackImage?: string;
  displayId?: boolean;
  displayStory?: boolean;
  debug?: boolean;
}

export interface ParsedCharacter extends CharacterRawData { parsedSkills: ParsedSkill[]; }
export interface ParsedSkill extends SkillRawData { parsedDescription: ParsedDescription; children: ParsedChild[]; }
export interface ParsedEntity extends EntityRawData { parsedDescription: ParsedDescription; }
export interface ParsedActionCard extends ActionCardRawData { parsedDescription: ParsedDescription; children: ParsedChild[]; }
export interface ParsedKeyword extends KeywordRawData { parsedDescription: ParsedDescription; }
export type ParsedChild = ParsedSkill | ParsedEntity | ParsedActionCard | ParsedKeyword;

export type TokenStyle = 'strong' | 'light' | 'dimmed';
export type DescriptionToken =
  | { type: 'plain'; text: string; style: () => TokenStyle | 'normal'; color?: string }
  | { type: 'boxedKeyword'; text: string }
  | { type: 'hiddenKeyword'; id: number }
  | { type: 'reference'; refType: string; id: number; overrideStyle: () => TokenStyle | undefined; manualColor?: string }
  | { type: 'errored'; text: string }
  | { type: 'lineBreak' }
  | { type: 'icon'; id: number; overrideStyle: () => TokenStyle | undefined };
export type ParsedDescription = DescriptionToken[];

export interface AppContextValue extends AppProps {
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
  prepareSkillToEntityMap: Map<number, number>;
}

export type { ActionCardRawData, CharacterRawData, EntityRawData, KeywordRawData, PlayCost, SkillRawData };
