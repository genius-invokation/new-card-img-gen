import { createSignal, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import type { SkillRawData } from "@gi-tcg/static-data";
import {
  type AppConfig,
  type RenderContext,
  type ParsedCharacter,
  type ParsedActionCard,
  type Language,
} from "../../types";
import { parseCharacter, parseActionCard } from "../../parser";
import { GlobalSettings, RenderContextProvider } from "../../context";
import { Character } from "./Character";
import { ActionCard } from "./ActionCard";
import "./Renderer.css";
import { VERSION_REPLACE_STRS } from "../../constants";
import { PageTitle } from "./PageTitle";

export const Renderer = (props: AppConfig) => {
  const renderingObjects = createMemo<RenderingObjects>(() => {
    const mode = props.mode;
    const data = props.data;
    const version = props.version;
    const keywords = data.keywords.map((k) => ({ ...k, id: -k.id }));
    const skills = [...data.characters, ...data.entities].flatMap(
      (e) => e.skills as SkillRawData[],
    );
    const genericEntities = [...data.actionCards, ...data.entities];
    const names = new Map<number, string>(
      [...genericEntities, ...data.characters, ...skills].map(
        (e) => [e.id, e.name] as const,
      ),
    );
    const keywordToEntityMap = new Map(
      keywords
        .filter((k) => k.name && k.id > 1000)
        .map((k) => {
          const match = data.entities.find(
            (e) =>
              e.name === k.name &&
              e.id > 110000 &&
              !(e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"),
          );
          return match ? ([k.id, match] as const) : null;
        })
        .filter((pair) => !!pair),
    );
    const prepareSkillToEntityMap = new Map(
      data.entities
        .filter((e) => (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL"))
        .flatMap((entity) => {
          const matches = [
            ...entity.rawDescription.matchAll(/\$\[S(\d{5}|\d{7})\]/g),
          ];
          return matches.map((m) => [parseInt(m[1], 10), entity]);
        }),
    );
    const renderContext: RenderContext = {
      skills,
      genericEntities,
      keywords,
      names,
      supIds: [],
      keywordToEntityMap,
      prepareSkillToEntityMap,
    };

    let character: ParsedCharacter | null = null;
    const actionCards: ParsedActionCard[] = [];
    if (mode === "character") {
      const collected = data.characters.find((c) => c.id === props.characterId);
      if (collected) {
        character = parseCharacter(renderContext, collected);
        const talent = data.actionCards.find(
          (ac) => ac.relatedCharacterId === collected.id,
        );
        if (talent) {
          actionCards.push(parseActionCard(renderContext, talent));
        }
      }
    } else if (mode === "singleActionCard") {
      const actionCard = data.actionCards.find(
        (c) => c.id === props.actionCardId,
      );
      if (actionCard) {
        actionCards.push(parseActionCard(renderContext, actionCard));
      }
    } else if (mode === "versionedActionCards") {
      const collected = data.actionCards.filter(
        (ac) =>
          ac.sinceVersion === version &&
          ac.obtainable &&
          !ac.tags.includes("GCG_TAG_TALENT"),
      );
      actionCards.push(
        ...collected.map((c) => parseActionCard(renderContext, c)),
      );
    }

    const v = props.version;
    let title: string | null = null;
    let versionText: string | null = null;
    if (v) {
      let rawVersion: string = v.startsWith("v") ? v.slice(1) : v;
      if (rawVersion.endsWith("-beta")) rawVersion = rawVersion.slice(0, -5);
      const [major, minor, patch] = rawVersion.split(".");
      const isBeta = Number(patch) >= 50;
      let mainVersionText = isBeta
        ? `${major}.${Number(minor) + 1}`
        : `${major}.${minor}`;

      mainVersionText =
        VERSION_REPLACE_STRS[mainVersionText]?.[props.language] ||
        mainVersionText;

      versionText = isBeta
        ? ` Beta ${mainVersionText} v${Number(patch) - 49}`
        : mainVersionText;
      if (props.mode === "versionedActionCards") {
        title = {
          CHS: `${mainVersionText}版本新增行动牌`,
          EN: `Action Cards added in ${mainVersionText}`,
        }[props.language];
      }
    }
    return { mode, title, character, actionCards, versionText, renderContext };
  });

  interface RenderingObjects {
    title: string | null;
    character: ParsedCharacter | null;
    actionCards: ParsedActionCard[];
    versionText: string | null;
    renderContext: RenderContext;
  }

  const getRenderContext = () => renderingObjects().renderContext;
  const empty = () =>
    !renderingObjects().character &&
    renderingObjects().actionCards.length === 0;

  return (
    <RenderContextProvider value={getRenderContext}>
      <div
        class="layout"
        classList={{
          "single-action-card": props.mode === "singleActionCard",
          empty: empty(),
        }}
        data-language={props.language}
      >
        <Show when={renderingObjects().title}>
          {(title) => <PageTitle text={title()} />}
        </Show>
        <Show when={renderingObjects().character}>
          {(c) => <Character character={c()} />}
        </Show>
        <For each={renderingObjects().actionCards}>
          {(ac) => <ActionCard card={ac} />}
        </For>
        <Show when={empty()}>无数据</Show>
        <div class="version-layout">
          <div class="version-text">
            {props.authorName || renderingObjects().versionText}
          </div>
          <Show when={props.authorImageUrl}>
            {(url) => <img src={url()} class="logo" />}
          </Show>
        </div>
      </div>
    </RenderContextProvider>
  );
};
