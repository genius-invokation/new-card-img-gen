import { For, Show } from "solid-js";
import type {
  ParsedChild,
  ParsedActionCard,
  ParsedEntity,
  ParsedKeyword,
} from "../types";
import { useAppContext, useRenderContext } from "../context";
import { KeywordIcon } from "./KeywordIcon";
import { KeywordTag } from "./KeywordTag";
import { Cost } from "./Cost";
import { Description } from "./Token";
import {
  KEYWORD_CARDBACK_BOTTOM,
  KEYWORD_CARDBACK_REPEAT,
  KEYWORD_CARD_FRAME,
  COST_READONLY_ENTITIES,
} from "../constants";
import { cardFaceUrl } from "../utils";
import { Text } from "./Text";
import "./Children.css";

type AnyChild = ParsedChild & {
  cardFace?: string;
  playCost?: { type: string; count: number }[];
  tags?: string[];
  type?: string; // entity/action/keyword category
  name?: string;
  icon?: string;
  buffIcon?: string;
};

export const Children = (props: { children: ParsedChild[] }) => {
  const { displayId, language } = useAppContext();
  const renderContext = useRenderContext();

  return (
    <div class="child-layout">
      <For each={props.children}>
        {(raw) => {
          const child = raw as AnyChild;
          const preparing = renderContext().prepareSkillToEntityMap.get(
            child.id,
          );
          return (
            <div class="keyword-box-wrapper">
              <div class="keyword-line" />
              <Show when={child.cardFace}>
                <div class="keyword-card">
                  <img
                    src={KEYWORD_CARDBACK_BOTTOM}
                    class="keyword-card-back-bottom"
                  />
                  <div
                    class="keyword-card-back-repeat"
                    style={{ "--image": `url("${KEYWORD_CARDBACK_REPEAT}")` }}
                  />
                  <img
                    src={cardFaceUrl(child.cardFace || "")}
                    class="keyword-card-face"
                  />
                  <img src={KEYWORD_CARD_FRAME} class="keyword-card-frame" />
                </div>
              </Show>
              <div class="keyword-box">
                <div class="keyword-buff-box">
                  <Show when={!child.cardFace}>
                    <KeywordIcon
                      id={child.id}
                      tag={child.type || "GCG_RULE_EXPLANATION"}
                      image={child.buffIcon || child.icon}
                    />
                  </Show>
                  <div class="keyword-title-box">
                    <div class="keyword-title">
                      <Text text={child.name} />
                    </div>
                    <div class="keyword-tags">
                      <KeywordTag tag={child.type || "GCG_RULE_EXPLANATION"} />
                      <For each={child.tags || []}>
                        {(tag) => <KeywordTag tag={tag} />}
                      </For>
                      <Show when={preparing}>
                        <KeywordTag tag="GCG_TAG_PREPARE_SKILL" />
                      </Show>
                      <Show when={displayId()}>
                        <div class="id-box">ID: {child.id}</div>
                      </Show>
                      <Show when={displayId() && preparing}>
                        {(preparing) => (
                          <div class="id-box">ID: {preparing().id}</div>
                        )}
                      </Show>
                    </div>
                  </div>
                </div>
                <Show when={child.playCost}>
                  <Cost
                    type="keyword"
                    cost={
                      child.playCost && child.playCost.length === 0
                        ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
                        : child.playCost || []
                    }
                    readonly={
                      COST_READONLY_ENTITIES.includes(child.id) || !!preparing
                    }
                  />
                </Show>
                <div
                  class={`keyword-description keyword-description-${language()}`}
                >
                  <Description
                    description={
                      (child as ParsedActionCard | ParsedEntity | ParsedKeyword)
                        .parsedDescription
                    }
                  />
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
