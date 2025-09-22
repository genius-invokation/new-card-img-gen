import { createSignal, createMemo, onCleanup } from "solid-js";
import { For, Show } from "solid-js";
import type { ActionCardRawData, CharacterRawData, EntityRawData, KeywordRawData, SkillRawData } from "@gi-tcg/static-data";
import type { AppProps, AppContextValue } from "./types/app";
import { parseCharacter, parseActionCard } from "./parsers/description";
import { AppContext } from './context/appContext';
import { Character } from './components/Character';
import { ActionCard } from './components/ActionCard';
import { PageTitle } from './components/PageTitle';
import { MOCK_DATA } from "./mock-data";
import "./App.css";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。
// 默认应用配置（从原内联常量抽出，若需要可移动到独立文件）
const APP_CONFIG: AppProps = {
  language: 'zh',
  authorName: 'Author',
  authorImageUrl: '/vite.svg',
  cardbackImage: 'UI_Gcg_CardBack_Fonta_03',
  displayId: true,
  displayStory: true,
  mirroredLayout: false,
};

// ---------------- AppImpl (版本/solo 渲染) ----------------
const AppImpl = (props: AppProps & { ctx: AppContextValue }) => {
  const { data, language = "zh" } = props.ctx;
  props.ctx.supIds.length = 0;
  if (props.version) {
    let versionStr: string = props.version;
    if (versionStr.startsWith("v")) versionStr = versionStr.slice(1);
    if (versionStr.endsWith("-beta")) versionStr = versionStr.slice(0, -5);
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
    } as Record<string, string>;
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
      const character = parseCharacter(props.ctx, c);
      const talentRaw = data.actionCards.find(
        (ac) => ac.relatedCharacterId === character.id,
      );
      return {
        character,
        talent: talentRaw ? parseActionCard(props.ctx, talentRaw) : null,
      };
    });
    const actionCardsParsed = shownActionCards.map((c) =>
      parseActionCard(props.ctx, c),
    );
    return (
      <>
        <For each={charactersParsed}>
          {({ character, talent }) => (
            <div class="layout">
              <Character character={character} />
              <Show when={talent}>
                <ActionCard card={talent!} />
              </Show>
            </div>
          )}
        </For>
        <div class={`layout ${props.mirroredLayout ? "flip" : ""}`}>
          <PageTitle text={pageTitle[language]} />
          <For each={actionCardsParsed}>{(c) => <ActionCard card={c} />}</For>
          <div class="version-layout">
            <div class="version-text">{versionText}</div>
            <img src={props.authorImageUrl} class="logo" />
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
          <div class="layout">
            <Character character={parseCharacter(props.ctx, character)} />
            <Show when={talent}>
              <ActionCard card={parseActionCard(props.ctx, talent!)} />
            </Show>
            <div class="version-layout">
              <div class="version-text">{props.authorName}</div>
              {props.authorImageUrl ? (
                <img src={props.authorImageUrl} class="logo" />
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
            class="layout"
            style={{
              "padding-top": "0rem",
              "background-image":
                'url("assets/frame/header_decor_onecard.png")',
            }}
          >
            <ActionCard card={parseActionCard(props.ctx, actionCard)} />
            <div class="version-layout">
              <div class="version-text">{props.authorName}</div>
              {props.authorImageUrl ? (
                <img src={props.authorImageUrl} class="logo" />
              ) : (
                <div />
              )}
            </div>
          </div>
        );
      }
    }
  }
  // 默认：展示 mock 第一张角色与一张行动牌
  const ctx = props.ctx;
  const character = parseCharacter(ctx, ctx.data.characters[0]);
  const firstAction = ctx.data.actionCards[0]
    ? parseActionCard(ctx, ctx.data.actionCards[0])
    : null;
  return (
    <div class="layout">
      <Character character={character} />
      <Show when={firstAction}>
        <ActionCard card={firstAction!} />
      </Show>
    </div>
  );
};

// ---------------- 根组件 ----------------
export const App = () => {
  const [config] = createSignal<AppProps>({ ...APP_CONFIG });
  // 使用 mock 数据构建 data 结构（保留接口字段）
  const data = createMemo<AppContextValue["data"]>(() => {
    const characters = MOCK_DATA.characters as CharacterRawData[];
    const actionCards = MOCK_DATA.actionCards as ActionCardRawData[];
    const entities = MOCK_DATA.entities as EntityRawData[];
    const keywords = MOCK_DATA.keywords as KeywordRawData[];
    const skills = [...characters, ...entities].flatMap(
      (e) => e.skills as SkillRawData[],
    );
    const genericEntities = [...actionCards, ...entities];
    return {
      characters,
      actionCards,
      entities,
      keywords,
      skills,
      genericEntities,
    };
  });

  const supIds: number[] = [];
  const names = new Map<number, string>(
    [...data().genericEntities, ...data().characters, ...data().skills].map(
      (e) => [e.id, e.name] as const,
    ),
  );
  const keywordToEntityMap = new Map(
    data()
      .keywords.filter((k) => k.name && k.id > 1000)
      .map((k) => {
        const match = data().genericEntities.find(
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
    data()
      .entities.filter((e) =>
        (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"),
      )
      .flatMap((entity) => {
        const matches = [
          ...entity.rawDescription.matchAll(/\$\[S(\d{5}|\d{7})\]/g),
        ];
        return matches.map((m) => [parseInt(m[1], 10), entity.id]);
      }),
  );
  const ctx: AppContextValue = {
    ...config(),
    data: data(),
    supIds,
    names,
    keywordToEntityMap,
    prepareSkillToEntityMap,
  };

  // 监听自定义事件 config（保留接口）
  const handler = (e: Event) => {
    const ce = e as CustomEvent<AppProps>;
    Object.assign(ctx, ce.detail);
  };
  window.addEventListener("config", handler as any);
  onCleanup(() => window.removeEventListener("config", handler as any));

  return (
    <AppContext.Provider value={ctx}>
      <AppImpl {...config()} ctx={ctx} />
    </AppContext.Provider>
  );
};
