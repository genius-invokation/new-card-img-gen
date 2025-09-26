import { createSignal, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import type { SkillRawData } from "@gi-tcg/static-data";
import {
  type AppConfig,
  type RenderContext,
  type ParsedCharacter,
  type ParsedActionCard,
} from "../../types";
import { parseCharacter, parseActionCard } from "../../parser";
import { GlobalSettings, RenderContextProvider } from "../../context";
import { Character } from "./Character";
import { ActionCard } from "./ActionCard";
import "./Renderer.css";

export const Renderer = (props: AppConfig) => {
  const renderingObjects = createMemo<RenderingObjects>(() => {
    const data = props.data;
    const keywords = data.keywords;
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

    let mode: RenderingObjects["mode"] | null = null;
    let character: ParsedCharacter | null = null;
    const actionCards: ParsedActionCard[] = [];
    if (props.solo) {
      const type = props.solo[0];
      const id = Number(props.solo.slice(1));
      if (type === "A") {
        mode = "character";
        const collected = data.characters.find((c) => c.id === id);
        if (collected) {
          character = parseCharacter(renderContext, collected);
          const talent = data.actionCards.find(
            (ac) => ac.relatedCharacterId === collected.id,
          );
          if (talent) {
            actionCards.push(parseActionCard(renderContext, talent));
          }
        }
      } else if (type === "C") {
        mode = "singleActionCard";
        const actionCard = data.actionCards.find((c) => c.id === id);
        if (actionCard) {
          actionCards.push(parseActionCard(renderContext, actionCard));
        }
      }
    } else if (props.version) {
      mode = "versionedActionCards";
      const version = props.version;
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
    return { mode, character, actionCards, renderContext };
  });
  // TODO
  const versionText = createMemo(() => {
    const v = props.version;
    if (!v) return;
    let rawVersion: string = v.startsWith("v") ? v.slice(1) : v;
    if (rawVersion.endsWith("-beta")) rawVersion = rawVersion.slice(0, -5);
    const [major, minor, patch] = rawVersion.split(".");
    const isBeta = Number(patch) >= 50;
    const mainVersionText = isBeta
      ? `${major}.${Number(minor) + 1}`
      : `${major}.${minor}`;
    const versionText = isBeta
      ? ` Beta ${mainVersionText} v${Number(patch) - 49}`
      : mainVersionText;
    const pageTitle: Record<string, string> = {
      zh: `${mainVersionText}版本新增行动牌`,
      en: `Action Cards added in ${mainVersionText}`,
    };
    return { pageTitle, versionText };
  });

  interface RenderingObjects {
    mode: "character" | "singleActionCard" | "versionedActionCards" | null;
    character: ParsedCharacter | null;
    actionCards: ParsedActionCard[];
    renderContext: RenderContext;
  }

  const getRenderContext = () => renderingObjects().renderContext;

  return (
    <RenderContextProvider value={getRenderContext}>
      <div class="renderer">
        <div
          class="layout"
          classList={{
            "single-action-card":
              renderingObjects().mode === "singleActionCard",
          }}
        >
          <Show when={renderingObjects().character}>
            {(c) => <Character character={c()} />}
          </Show>
          <For each={renderingObjects().actionCards}>
            {(ac) => <ActionCard card={ac} />}
          </For>
          <div class="version-layout">
            <div class="version-text">{props.authorName}</div>
            <Show when={props.authorImageUrl}>
              {(url) => <img src={url()} class="logo" />}
            </Show>
          </div>
        </div>
      </div>
    </RenderContextProvider>
  );
};
