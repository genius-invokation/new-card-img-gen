import {
  BOLD_COLOR,
  CHILDREN_CONFIG,
  DAMAGE_KEYWORD_MAP,
  KEYWORD_COLORS,
  SHOWN_KEYWORDS,
  correctId,
} from "./constants";
import type {
  DescriptionToken,
  ParsedDescription,
  ParsedChild,
  ParsedSkill,
  SkillRawData,
  ActionCardRawData,
  ParsedCharacter,
  CharacterRawData,
  RenderContext,
} from "./types";

interface ChildLikeBase {
  id: number;
  rawDescription: string;
  keyMap?: Record<string, string>;
  tags?: string[];
  skills?: SkillRawData[];
  buffIcon?: string;
}

// 颜色规范
// remapColors 是纯工具函数，不依赖 Solid 响应式系统
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
/* eslint-disable solid/reactivity */
export const remapColors = (props: {
  color: string | undefined;
  style?: "text" | "outline";
}) => {
  const COLOR_MAPS: Record<string, Record<string, string>> = {
    "#99FFFFFF": { textColor: "#63bacd", outlineColor: "#68c4d9" },
    "#80C0FFFF": { textColor: "#488ccb", outlineColor: "#4c95d9" },
    "#FF9999FF": { textColor: "#d6684b", outlineColor: "#e06e4f" },
    "#FFACFFFF": { textColor: "#917ce8", outlineColor: "#967ff0" },
    "#80FFD7FF": { textColor: "#5ca8a6", outlineColor: "#68bdba" },
    "#FFE699FF": { textColor: "#d29d5d", outlineColor: "#dba460" },
    "#7EC236FF": { textColor: "#88b750", outlineColor: "#97c959" },
  };
  if (!props.color) return;
  if (props.style === "outline")
    return COLOR_MAPS[props.color]
      ? COLOR_MAPS[props.color].outlineColor
      : props.color;
  return COLOR_MAPS[props.color]
    ? COLOR_MAPS[props.color].textColor
    : props.color;
};
/* eslint-enable solid/reactivity */

export const parseDescription = (
  ctx: RenderContext,
  rawDescription: string,
  keyMap: Record<string, string> = {},
  ignoreParentheses = false,
): ParsedDescription => {
  const { names, keywordToEntityMap } = ctx;
  const segments = rawDescription
    .replace(/<color=#FFFFFFFF>(\$\[[ACSK]\d+\])<\/color>/g, "$1")
    .replace(/<color=#([0-9A-F]{8})>/g, "###COLOR#$1###")
    .replace(/<\/color>/g, "###/COLOR###")
    .replace(/\$\[K(3|4)\](?::\s|：)(\d+)/g, "###BOXED#$1#$2###")
    .replace(/[（(]/g, "###LBRACE###（")
    .replace(/[）)]/g, "）###RBRACE###")
    .replace(/(\\n)+/g, "###BR###")
    .replace(/\$\{(.*?)\}/g, (_, g1: string) => keyMap[g1] ?? "")
    .replace(/\{SPRITE_PRESET#(\d+)\}/g, "###SPRITE#$1###")
    .replace(/\$\[(.*?)\]/g, "###REF#$1###")
    .split("###");
  const result: DescriptionToken[] = [];
  interface ColorInfo {
    rawColor: string;
    isBold: boolean;
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
        return (this.overrideStyle() ?? "normal") as
          | "normal"
          | "light"
          | "dimmed"
          | "strong";
      },
    };
    if (text === "BR") {
      result.push({ type: "lineBreak" });
    } else if (text === "LBRACE") {
      if (!ignoreParentheses)
        parentheses.push({
          afterBr:
            lastToken?.type === "lineBreak" ||
            lastToken?.type === "boxedKeyword",
        });
    } else if (text === "RBRACE") {
      if (!ignoreParentheses) parentheses.pop();
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
        /[:：]$/.test(lastToken.text) &&
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
        result.push({ type: "plain", text: String(keyMap[ref]), ...styles });
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
              id: mappedC.id,
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
        const keyword = ctx.keywords.find((e) => e.id === usingKeywordId);
        if (keyword) {
          const rawNameSplit = keyword.rawName.split("|s1:");
          const rawName =
            rawNameSplit[rawNameSplit.length - 1] ?? keyword.rawName;
          result.push(
            { type: "hiddenKeyword", id: usingKeywordId },
            ...parseDescription(ctx, rawName).map((token) => {
              if (token.type === "plain") {
                return {
                  ...token,
                  style: () => {
                    const outer = styles.style();
                    return outer === "normal" ? token.style() : outer;
                  },
                  color: KEYWORD_COLORS[usingKeywordId] ?? token.color,
                } as const;
              } else if (token.type === "reference" || token.type === "icon") {
                return {
                  ...token,
                  overrideStyle: () =>
                    styles.overrideStyle() ?? token.overrideStyle(),
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
      const parts = text.split("#");
      const id2 = parts[1];
      const count = parts[2];
      const keywordId = Number(id2);
      const { name } = ctx.keywords.find((e) => e.id === keywordId) ?? {
        name: "",
      };
      result.push({ type: "boxedKeyword", text: `${name}：${count}` });
    } else if (text.startsWith("SPRITE#")) {
      const id = Number(text.substring(7));
      result.push({ type: "icon", id, ...styles });
    } else if (text) {
      result.push({ type: "plain", text, color, ...styles });
    }
  }
  return result;
};

export const appendChildren = (
  ctx: RenderContext,
  childData: ChildLikeBase,
  scope: "all" | "self" | "children" = "all",
): ParsedChild[] => {
  const parsedDescription = parseDescription(
    ctx,
    childData.rawDescription,
    "keyMap" in childData ? childData.keyMap : {},
  );
  const result: ParsedChild[] = [];
  if (scope !== "children") {
    const self: ParsedChild = {
      ...(childData as unknown as ParsedChild),
      parsedDescription,
    };
    result.push(self);
    if (
      childData.tags &&
      childData.tags.includes("GCG_TAG_VEHICLE") &&
      childData.skills
    ) {
      let moveBuffIcon = false;
      for (const skill of childData.skills) {
        if (skill.type === "GCG_SKILL_TAG_VEHICLE") {
          (skill as unknown as { buffIcon?: string }).buffIcon =
            childData.buffIcon;
          moveBuffIcon = true;
        }
      }
      if (moveBuffIcon && "buffIcon" in self) {
        delete (self as unknown as { buffIcon?: string }).buffIcon;
      }
    }
  }
  if (scope === "self") return result;
  const manuallyConfigChilren = CHILDREN_CONFIG[childData.id];
  const subScope = manuallyConfigChilren ? "self" : "all";
  const children = manuallyConfigChilren
    ? parseDescription(ctx, manuallyConfigChilren)
    : parsedDescription;
  for (const child of children) {
    if (child.type === "reference") {
      if (ctx.supIds.includes(child.id)) continue;
      ctx.supIds.push(child.id);
      switch (child.refType) {
        case "S": {
          const skillData = ctx.skills.find((sk) => sk.id === child.id);
          if (!skillData) continue;
          result.push(...appendChildren(ctx, skillData, subScope));
          break;
        }
        case "C": {
          const entityDataMerged = ctx.genericEntities
            .filter((e) => e.id === child.id)
            .reduce<Record<string, unknown>>(
              (acc, e) => ({ ...acc, ...e }),
              {},
            );
          if (!("id" in entityDataMerged)) continue;
          // entityDataMerged now behaves as ChildLikeBase
          result.push(
            ...appendChildren(
              ctx,
              entityDataMerged as unknown as ChildLikeBase,
              subScope,
            ),
          );
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
      if (ctx.supIds.includes(-child.id)) continue;
      ctx.supIds.push(-child.id);
      const keywordData = ctx.keywords.find((e) => e.id === child.id);
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

export const parseCharacterSkill = (
  ctx: RenderContext,
  skill: SkillRawData,
): ParsedSkill => {
  const parsedDescription = parseDescription(
    ctx,
    skill.rawDescription,
    skill.keyMap,
    true,
  );
  const children = appendChildren(ctx, skill, "children");
  return { ...skill, parsedDescription, children };
};

export const parseCharacter = (
  ctx: RenderContext,
  data:
    | CharacterRawData
    | ({ skills: SkillRawData[] } & Record<string, unknown>),
): ParsedCharacter => {
  ctx.supIds.push(...data.skills.flatMap((sk) => (sk.hidden ? [] : [sk.id])));
  const parsedSkills = data.skills.flatMap((skill) =>
    skill.hidden ? [] : [parseCharacterSkill(ctx, skill)],
  );
  return {
    ...(data as Record<string, unknown>),
    parsedSkills,
  } as ParsedCharacter;
};

export const parseActionCard = (
  ctx: RenderContext,
  data: ActionCardRawData,
) => {
  ctx.supIds.push(data.id);
  return {
    ...data,
    parsedDescription: parseDescription(ctx, data.rawDescription),
    children: appendChildren(ctx, data, "children"),
  };
};
