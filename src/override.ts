import type {
    CharacterRawData,
    SkillRawData,
    EntityRawData,
    ActionCardRawData
} from "./types";
import {
    overrideCharacterData,
    overrideSkillData,
    overrideEntityData,
    overrideActionCardData,
} from "./constants";

export const applyOverrides = <T extends { id: number }>(
    data: T[],
    overrides: Partial<T>[]
): T[] => {
    const result = [...data];
    const overrideMap = new Map(overrides.map(override => [override.id!, override]));

    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const override = overrideMap.get(item.id);
        if (override) {
            result[i] = { ...item, ...override };
            overrideMap.delete(item.id);
        }
    }

    for (const override of overrideMap.values()) {
        if (override.id !== undefined) {
            result.push(override as T);
        }
    }

    return result;
};

export const applyCharacterOverrides = (characters: CharacterRawData[]): CharacterRawData[] => {
    return applyOverrides(characters, overrideCharacterData);
};

export const applySkillOverrides = (skills: SkillRawData[]): SkillRawData[] => {
    return applyOverrides(skills, overrideSkillData);
};

export const applyEntityOverrides = (entities: EntityRawData[]): EntityRawData[] => {
    return applyOverrides(entities, overrideEntityData);
};

export const applyActionCardOverrides = (actionCards: ActionCardRawData[]): ActionCardRawData[] => {
    return applyOverrides(actionCards, overrideActionCardData);
};
