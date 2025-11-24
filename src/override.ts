import type {
  Language,
  Version,
  OverrideData,
  CharacterRawData,
  SkillRawData,
  EntityRawData,
  ActionCardRawData,
} from "./types";
import {
  overrideCharacterData,
  overrideEntityData,
  overrideActionCardData,
} from "./constants";

function parseVersion(version: Version): { major: number; minor: number; patch: number; beta: boolean } | null {
  if (version === "latest") {
    return { major: Infinity, minor: Infinity, patch: Infinity, beta: false };
  }
  const match = version.match(/^v(\d+)\.(\d+)\.(\d+)(-beta)?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    beta: !!match[4],
  };
}

function compareVersions(v1: ReturnType<typeof parseVersion>, v2: ReturnType<typeof parseVersion>): number {
  if (!v1 || !v2) return 0;
  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  if (v1.patch !== v2.patch) return v1.patch - v2.patch;
  if (v1.beta !== v2.beta) return v1.beta ? -1 : 1;
  return 0;
}

export function satisfiesVersion(version: Version, range: string): boolean {
  if (range === "*" || range === "x" || range === "X") {
    return true;
  }
  
  if (range === "latest") {
    return version === "latest";
  }

  if (version === "latest") {
    const isExactVersion = /^v\d+\.\d+\.\d+(-beta)?$/.test(range.trim());
    return !isExactVersion;
  }
  
  const parsedVersion = parseVersion(version);
  if (!parsedVersion) return false;
  
  if (range.includes("||")) {
    return range.split("||").some((r) => satisfiesVersion(version, r.trim()));
  }
  
  if (range.includes(" - ")) {
    const [min, max] = range.split(" - ").map((s) => s.trim());
    const minVersion = parseVersion(min as Version);
    const maxVersion = parseVersion(max as Version);
    if (!minVersion || !maxVersion) return false;
    return compareVersions(minVersion, parsedVersion) <= 0 && compareVersions(parsedVersion, maxVersion) <= 0;
  }
  
  if (range.startsWith("^")) {
    const baseVersion = parseVersion(range.slice(1) as Version);
    if (!baseVersion) return false;
    if (compareVersions(baseVersion, parsedVersion) > 0) return false;
    const nextMajor = { ...baseVersion, major: baseVersion.major + 1, minor: 0, patch: 0, beta: false };
    return compareVersions(parsedVersion, nextMajor) < 0;
  }
  
  if (range.startsWith("~")) {
    const baseVersion = parseVersion(range.slice(1) as Version);
    if (!baseVersion) return false;
    if (compareVersions(baseVersion, parsedVersion) > 0) return false;
    const nextMinor = { ...baseVersion, minor: baseVersion.minor + 1, patch: 0, beta: false };
    return compareVersions(parsedVersion, nextMinor) < 0;
  }
  
  const match = range.match(/^(>=|<=|>|<)(.+)$/);
  if (match) {
    const operator = match[1];
    const targetVersion = parseVersion(match[2].trim() as Version);
    if (!targetVersion) return false;
    const comparison = compareVersions(parsedVersion, targetVersion);
    switch (operator) {
      case ">=":
        return comparison >= 0;
      case "<=":
        return comparison <= 0;
      case ">":
        return comparison > 0;
      case "<":
        return comparison < 0;
      default:
        return false;
    }
  }
  
  const exactVersion = parseVersion(range as Version);
  if (exactVersion) {
    return compareVersions(parsedVersion, exactVersion) === 0;
  }
  
  return false;
}

function applyOverrideValue<T>(oldValue: T, overrideValue: OverrideData<T>): T {
  if (typeof overrideValue === "function") {
    return (overrideValue as (value: T) => T)(oldValue);
  }
  
  if (Array.isArray(overrideValue) && Array.isArray(oldValue)) {
    // 检查数组元素是否有id属性（用于按id匹配，如skills）
    const firstOverride = overrideValue[0] as any;
    const hasId = firstOverride && typeof firstOverride === "object" && "id" in firstOverride;
    
    if (hasId) {
      // 按id匹配：保持原数组的所有元素，只更新匹配的项
      const result = [...oldValue] as any[];
      const oldValueMap = new Map(
        oldValue.map((item: any, index) => [item?.id, index])
      );
      
      // 对每个override，找到对应的oldItem并更新
      for (const ov of overrideValue) {
        if (ov && typeof ov === "object" && "id" in ov) {
          const oldIndex = oldValueMap.get((ov as any).id);
          if (oldIndex !== undefined) {
            const oldItem = oldValue[oldIndex];
            result[oldIndex] = applyOverrideValue(oldItem, ov as OverrideData<typeof oldItem>);
          }
        }
      }
      
      return result as T;
    } else {
      // 按索引匹配（用于普通数组）
      return overrideValue.map((ov, index) => {
        const oldItem = oldValue[index];
        if (oldItem !== undefined) {
          return applyOverrideValue(oldItem, ov as OverrideData<typeof oldItem>);
        }
        return ov as T extends (infer U)[] ? U : never;
      }) as T;
    }
  }
  
  if (typeof overrideValue === "object" && overrideValue !== null && typeof oldValue === "object" && oldValue !== null) {
    const result = { ...oldValue };
    for (const key in overrideValue) {
      if (key in oldValue) {
        (result as any)[key] = applyOverrideValue(
          (oldValue as any)[key],
          (overrideValue as any)[key]
        );
      } else {
        const overrideProp = (overrideValue as any)[key];
        if (typeof overrideProp !== "function") {
          (result as any)[key] = overrideProp;
        }
      }
    }
    return result as T;
  }
  
  return overrideValue as T;
}

export const applyOverrides = <T extends { id: number }>(
  data: T[],
  overrides: OverrideData<T>[],
  language: Language,
  version: Version
): T[] => {
  const result = [...data];
  const resultMap = new Map(result.map((item, index) => [item.id, index]));

  for (const override of overrides) {
    const overrideAny = override as any;
    if (!overrideAny.id) continue;

    const itemIndex = resultMap.get(overrideAny.id);
    if (itemIndex === undefined) continue;

    const item = result[itemIndex];

    if (overrideAny.language !== undefined) {
      const overrideLanguage = typeof overrideAny.language === "function"
        ? overrideAny.language(language)
        : overrideAny.language;
      if (overrideLanguage !== language) {
        continue;
      }
    }
    
    if (overrideAny.version !== undefined) {
      const versionRange = typeof overrideAny.version === "function"
        ? overrideAny.version(version)
        : overrideAny.version;
      if (!satisfiesVersion(version, versionRange)) {
        continue;
      }
    }
    
    const appliedOverride: any = {};
    for (const key in overrideAny) {
      if (key === "language" || key === "version") {
        continue;
      }
      
      const currentValue = (item as any)[key];
      
      if (key in item || currentValue !== undefined) {
        appliedOverride[key] = applyOverrideValue(
          currentValue,
          overrideAny[key]
        );
      } else {
        appliedOverride[key] = typeof overrideAny[key] === "function"
          ? undefined
          : overrideAny[key];
      }
    }
    
    if ("skills" in appliedOverride && "skills" in item && Array.isArray(appliedOverride.skills)) {
      const skillsOverride = appliedOverride.skills as OverrideData<SkillRawData>[];
      const originalSkills = (item as any).skills;
      appliedOverride.skills = applyOverrides(
        originalSkills,
        skillsOverride,
        language,
        version
      ) as any;
    }
    
    result[itemIndex] = { ...item, ...appliedOverride };
  }

  // for (const override of overrideMap.values()) {
  //   if (override.id !== undefined) {
  //     result.push(override as T);
  //   }
  // }

  return result;
};

export const applyCharacterOverrides = (
  characters: CharacterRawData[],
  language: Language,
  version: Version
): CharacterRawData[] => {
  return applyOverrides(characters, overrideCharacterData as any, language, version) as CharacterRawData[];
};

export const applyEntityOverrides = (
  entities: EntityRawData[],
  language: Language,
  version: Version
): EntityRawData[] => {
  return applyOverrides(entities, overrideEntityData as any, language, version) as EntityRawData[];
};

export const applyActionCardOverrides = (
  actionCards: ActionCardRawData[],
  language: Language,
  version: Version
): ActionCardRawData[] => {
  return applyOverrides(actionCards, overrideActionCardData as any, language, version) as ActionCardRawData[];
};
