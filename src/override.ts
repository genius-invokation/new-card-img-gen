import { satisfies } from "semver";
import type {
  Language,
  OverrideData,
  OverrideContext,
  BasicOverrideData,
  FnOverrideData,
} from "./types";

const isPlainObject = (obj: unknown): obj is Record<string, any> => {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

export const defineOverride = <T>(
  versionRange: string | null,
  language: Language | null,
  data: BasicOverrideData<T>,
): FnOverrideData<T> => {
  const fn = (old: T, ctx: OverrideContext): T => {
    if (language && ctx.language !== language) {
      return old;
    }
    if (versionRange && !satisfies(ctx.version, versionRange)) {
      return old;
    }
    return applyOverride(old, data, ctx);
  };
  if (data && "id" in (data as any)) {
    Object.defineProperty(fn, "id", {
      value: (data as any).id,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
  return fn as FnOverrideData<T>;
};

export function applyOverride<T>(
  oldValue: T,
  overrideValue: OverrideData<T>,
  context: OverrideContext,
): T {
  if (typeof overrideValue === "function") {
    return (overrideValue as (value: T, context: OverrideContext) => T)(
      oldValue,
      context,
    );
  }

  if (Array.isArray(overrideValue) && Array.isArray(oldValue)) {
    // 检查数组元素是否有 id 属性（用于按id匹配，如skills）
    const firstOverride = oldValue[0] as unknown;
    const hasId =
      firstOverride &&
      typeof firstOverride === "object" &&
      "id" in firstOverride;
    if (hasId) {
      // 按 id 匹配：保持原数组的所有元素，只更新匹配的项
      const result = [...oldValue] as unknown[];
      const oldValueMap = new Map(
        oldValue.map((item, index) => [item?.id, index]),
      );

      // 对每个override，找到对应的oldItem并更新
      for (const ov of overrideValue) {
        if (ov && "id" in ov) {
          const oldIndex = oldValueMap.get(ov.id);
          if (typeof oldIndex !== "undefined") {
            const oldItem = oldValue[oldIndex];
            result[oldIndex] = applyOverride(
              oldItem,
              ov as OverrideData<typeof oldItem>,
              context,
            );
          }
        }
      }

      return result as T;
    } else {
      // 按索引匹配（用于普通数组）
      return overrideValue.map((ov, index) => {
        const oldItem = oldValue[index];
        if (typeof oldItem !== "undefined") {
          return applyOverride(
            oldItem,
            ov as OverrideData<typeof oldItem>,
            context,
          );
        }
        return ov;
      }) as T;
    }
  }

  if (isPlainObject(overrideValue) && isPlainObject(oldValue)) {
    const result: any = { ...oldValue };
    for (const key in overrideValue) {
      if (key in oldValue) {
        result[key] = applyOverride(
          oldValue[key] as unknown,
          overrideValue[key] as OverrideData<unknown>,
          context,
        );
      }
    }
    return result as T;
  }

  return overrideValue as T;
}
