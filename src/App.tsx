import { createSignal, createMemo, createEffect, onCleanup } from "solid-js";
import { For, Show } from "solid-js";
import type { ActionCardRawData, CharacterRawData, EntityRawData, KeywordRawData, SkillRawData } from "@gi-tcg/static-data";
import type { AppProps, AppContextValue } from "./types";
import { parseCharacter, parseActionCard } from "./parser";
import { AppContext } from './context';
import { Character } from './components/Character';
import { ActionCard } from './components/ActionCard';
import { PageTitle } from './components/PageTitle';
import * as MOCK_DATA from "@gi-tcg/static-data";
import "./App.css";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。
// 默认应用配置（从原内联常量抽出，若需要可移动到独立文件）
const APP_CONFIG: AppProps = {
  solo: 'A1315',
  language: 'zh',
  authorName: 'Author',
  authorImageUrl: '/vite.svg',
  cardbackImage: 'UI_Gcg_CardBack_Fonta_03',
  displayId: true,
  displayStory: true,
  mirroredLayout: false,
};
const AppImpl = (props: AppProps & { ctx: AppContextValue }) => {
  const data = () => props.ctx.data;
  createEffect(() => {
    // 重置上标 ID 列表（依赖版本/solo 切换时重新计算）
    props.ctx.supIds.length = 0;
  });

  // 版本模式派生数据（仅在 props.version 存在时计算）
  const versionInfo = createMemo(() => {
    const v = props.version;
    if (!v) return undefined;
    let rawVersion: string = v.startsWith("v") ? v.slice(1) : v;
    if (rawVersion.endsWith("-beta")) rawVersion = rawVersion.slice(0, -5);
    const [major, minor, patch] = rawVersion.split(".");
    const isBeta = Number(patch) >= 50;
    const mainVersionText = isBeta ? `${major}.${Number(minor) + 1}` : `${major}.${minor}`;
    const versionText = isBeta ? ` Beta ${mainVersionText} v${Number(patch) - 49}` : mainVersionText;
    const pageTitle: Record<string, string> = {
      zh: `${mainVersionText}版本新增行动牌`,
      en: `Action Cards added in ${mainVersionText}`,
    };
    const shownCharacters = data().characters.filter(ch => ch.sinceVersion === v);
    const shownActionCards = data().actionCards.filter(
      ac => ac.sinceVersion === v && ac.obtainable && !ac.tags.includes("GCG_TAG_TALENT")
    );
    const charactersParsed = shownCharacters.map(c => {
      const character = parseCharacter(props.ctx, c);
      const talentRaw = data().actionCards.find(ac => ac.relatedCharacterId === character.id);
      return { character, talent: talentRaw ? parseActionCard(props.ctx, talentRaw) : undefined };
    });
    const actionCardsParsed = shownActionCards.map(c => parseActionCard(props.ctx, c));
    return { pageTitle, versionText, charactersParsed, actionCardsParsed };
  });

  // solo 模式派生
  const soloInfo = createMemo(() => {
    const s = props.solo;
    if (!s) return undefined;
    const type = s[0];
    const id = Number(s.slice(1));
    if (type === "A") {
      const character = data().characters.find(c => c.id === id);
      if (!character) return undefined;
      const talent = data().actionCards.find(ac => ac.relatedCharacterId === character.id);
      return { mode: "A" as const, character, talent };
    }
    if (type === "C") {
      const actionCard = data().actionCards.find(c => c.id === id);
      if (!actionCard) return undefined;
      return { mode: "C" as const, actionCard };
    }
    return undefined;
  });

  // 默认模式派生
  const defaultInfo = createMemo(() => {
    if (versionInfo() || soloInfo()) return undefined; // 其它模式不需要
    const ctx = props.ctx;
    const character = parseCharacter(ctx, ctx.data.characters[0]);
    const firstActionRaw = ctx.data.actionCards[0];
    const firstAction = firstActionRaw ? parseActionCard(ctx, firstActionRaw) : undefined;
    return { character, firstAction };
  });

  return (
    <>
      <Show when={versionInfo()} fallback={
        <Show when={soloInfo()} fallback={
          <Show when={defaultInfo()}>
            {(d) => (
              <div class="layout">
                <Character character={d().character} />
                <Show when={d().firstAction}>
                  {(fa) => <ActionCard card={fa()} />}
                </Show>
              </div>
            )}
          </Show>
        }>
          {(s) => (
            <>
              <Show when={s().mode === "A" && s().character} keyed>
                {(ch) => (
                  <div class="layout">
                    <Character character={parseCharacter(props.ctx, ch)} />
                    <Show when={s().talent}>
                      {(t) => <ActionCard card={parseActionCard(props.ctx, t())} />}
                    </Show>
                    <div class="version-layout">
                      <div class="version-text">{props.authorName}</div>
                      <Show when={props.authorImageUrl}>
                        {(url) => <img src={url()} class="logo" />}
                      </Show>
                    </div>
                  </div>
                )}
              </Show>
              <Show when={s().mode === "C" && 'actionCard' in s()}>
                <div
                  class="layout"
                  style={{
                    "padding-top": "0rem",
                    "background-image": 'url("assets/frame/header_decor_onecard.png")',
                  }}
                >
                  <ActionCard card={parseActionCard(props.ctx, (s() as { mode: 'C'; actionCard: ActionCardRawData }).actionCard)} />
                  <div class="version-layout">
                    <div class="version-text">{props.authorName}</div>
                    <Show when={props.authorImageUrl}>
                      {(url) => <img src={url()} class="logo" />}
                    </Show>
                  </div>
                </div>
              </Show>
            </>
          )}
        </Show>
      }>
        {(v) => (
          <>
            <For each={v().charactersParsed}>
              {({ character, talent }) => (
                <div class="layout">
                  <Character character={character} />
                  <Show when={talent}>
                    {(t) => <ActionCard card={t()} />}
                  </Show>
                </div>
              )}
            </For>
            <div class={`layout ${props.mirroredLayout ? "flip" : ""}`}>
              <PageTitle text={v().pageTitle[props.ctx.language || 'zh']} />
              <For each={v().actionCardsParsed}>{(c) => <ActionCard card={c} />}</For>
              <div class="version-layout">
                <div class="version-text">{v().versionText}</div>
                <Show when={props.authorImageUrl}>
                  {(url) => <img src={url()} class="logo" />}
                </Show>
              </div>
            </div>
          </>
        )}
      </Show>
    </>
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
  const names = createMemo(() => new Map<number, string>(
    [...data().genericEntities, ...data().characters, ...data().skills].map(
      (e) => [e.id, e.name] as const,
    ),
  ));
  const keywordToEntityMap = createMemo(() => new Map(
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
  ));
  const prepareSkillToEntityMap = createMemo(() => new Map(
    data()
      .entities.filter((e) => (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"))
      .flatMap((entity) => {
        const matches = [...entity.rawDescription.matchAll(/\$\[S(\d{5}|\d{7})\]/g)];
        return matches.map((m) => [parseInt(m[1], 10), entity.id]);
      }),
  ));
  const [ctxValue, setCtxValue] = createSignal<AppContextValue>() as unknown as [() => AppContextValue, (v: AppContextValue) => void];
  // 初始化及响应更新
  createEffect(() => {
    // 访问依赖使其被追踪
    const cfg = config();
    const d = data();
    setCtxValue({
      ...cfg,
      data: d,
      supIds,
      names: names(),
      keywordToEntityMap: keywordToEntityMap(),
      prepareSkillToEntityMap: prepareSkillToEntityMap(),
    });
  });

  // 监听自定义事件 config（保留接口）
  const handler = (e: Event) => {
    if (e instanceof CustomEvent) {
      setCtxValue({ ...ctxValue(), ...(e.detail as Partial<AppProps>) });
    }
  };
  window.addEventListener("config", handler);
  onCleanup(() => window.removeEventListener("config", handler));

  return (
    <Show when={ctxValue()}>
      {(val) => (
        <AppContext.Provider value={val()}>
          <AppImpl {...config()} ctx={val()} />
        </AppContext.Provider>
      )}
    </Show>
  );
};
