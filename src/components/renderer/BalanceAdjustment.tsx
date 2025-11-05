import { For, Show, createMemo, type JSX } from "solid-js";
import type { AdjustmentData, AdjustmentRecord } from "../../types";
import { useGlobalSettings } from "../../context";
import { Text } from "./Text";
import { cardFaceUrl, tagImageUrl } from "../../utils";
import { DESCRIPTION_ICON_IMAGES, ADJUSTMENT_SUBJECT_LABELS, ADJUSTMENT_TYPE_LABELS } from "../../constants";
import "./BalanceAdjustment.css";

export interface BalanceAdjustmentProps {
  adjustments: AdjustmentData[];
}

interface AdjustmentCardProps {
  id: number;
  offset: number;
  name: string | undefined;
  cardFaceItem: any;
  children?: JSX.Element;
}

const AdjustmentCard = (props: AdjustmentCardProps) => {
  return (
    <div class="adjustment-card">
      <div class="adjustment-card-title">
        <Text text={props.name} />
      </div>
      <div class="dashed-line" />
      <Show when={props.cardFaceItem}>
        <img
          src={cardFaceUrl(props.cardFaceItem)}
          class="adjustment-card-face"
          style={{
            top: `${props.offset}rem`,
          }}
        />
      </Show>
      {props.children}
    </div>
  );
};

// 解析富文本，支持 <b></b> 和 {SPRITE_PRESET#id}
const parseRichText = (text: string): JSX.Element[] => {
  if (!text) return [];

  const parts: JSX.Element[] = [];
  let currentIndex = 0;

  // 匹配 <b></b> 和 {SPRITE_PRESET#id}
  const regex = /(<b>.*?<\/b>|{SPRITE_PRESET#(\d+)})/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加匹配前的普通文本
    if (match.index > currentIndex) {
      parts.push(
        <span class="record-text-light">{text.substring(currentIndex, match.index)}</span>
      );
    }

    // 处理匹配的内容
    if (match[0].startsWith('<b>')) {
      // 处理 <b></b> 标签
      const boldText = match[0].replace(/<\/?b>/g, '');
      parts.push(
        <span class="record-text-bold">{boldText}</span>
      );
    } else if (match[2]) {
      // 处理 {SPRITE_PRESET#id}
      const iconId = Number(match[2]);
      const iconDef = DESCRIPTION_ICON_IMAGES[iconId] || {};
      if (iconDef.imageUrl) {
        parts.push(
          <img class="description-icon" src={iconDef.imageUrl} alt="" />
        );
      } else if (iconDef.tagIcon) {
        parts.push(
          <span
            class="description-icon-tag"
            style={{
              "--image": `url("${tagImageUrl(iconDef.tagIcon)}")`,
            }}
          />
        );
      }
    }

    currentIndex = match.index + match[0].length;
  }

  // 添加剩余的文本
  if (currentIndex < text.length) {
    parts.push(
      <span class="record-text-light">{text.substring(currentIndex)}</span>
    );
  }

  return parts.length > 0 ? parts : [<span class="record-text-light">{text}</span>];
};

const AdjustmentRecords = (props: { records: AdjustmentRecord[] }) => {
  const isInlineType = (type: string) => type === "hp" || type === "cost";
  const { allData } = useGlobalSettings();
  const names = createMemo(() => {
    const data = allData();
    return new Map(
      [...data.characters,
      ...data.actionCards,
      ...data.entities,
      ...data.characters.flatMap(c => c.skills),
      ...data.entities.flatMap(e => e.skills)
      ].map((v) => [v.id, v.name]),
    );
  });

  return (
    <div class="adjustment-records">
      <For each={props.records}>
        {(record) => {
          const recordName = createMemo(() => names()?.get(record.id));
          const title = record.subject === "self"
            ? `${ADJUSTMENT_TYPE_LABELS[record.type]}调整：`
            : `${ADJUSTMENT_SUBJECT_LABELS[record.subject]}「${recordName()}」${ADJUSTMENT_TYPE_LABELS[record.type]}调整：`;
          const isInline = isInlineType(record.type);

          return (
            <div class="adjustment-record">
              <div class="record-title">{title}</div>
              <Show when={isInline} fallback={
                <>
                  <div class="record-block">
                    <div class="record-label">旧</div>
                    <div class="record-content">{parseRichText(record.oldData)}</div>
                  </div>
                  <div class="record-block">
                    <div class="record-label">新</div>
                    <div class="record-content">{parseRichText(record.newData)}</div>
                  </div>
                </>
              }>
                <div class="record-inline">
                  <div class="record-content">{parseRichText(record.oldData)}</div>
                  <span class="record-arrow">→</span>
                  <div class="record-content">{parseRichText(record.newData)}</div>
                </div>
              </Show>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export const BalanceAdjustment = (props: BalanceAdjustmentProps) => {
  const { allData, displayId } = useGlobalSettings();

  return (
    <div class="balance-adjustment">
      <For each={props.adjustments}>
        {(adjustment) => {
          const cardData = createMemo(() => {
            const data = allData();
            // 先查找角色
            const character = data.characters.find(c => c.id === adjustment.id);
            if (character) {
              return {
                name: character.name,
                cardFace: character.cardFace,
                item: character
              };
            }
            // 再查找行动卡
            const actionCard = data.actionCards.find(c => c.id === adjustment.id);
            if (actionCard) {
              return {
                name: actionCard.name,
                cardFace: actionCard.cardFace,
                item: actionCard,
                isLegend: actionCard.tags.includes("GCG_TAG_LEGEND")
              };
            }
            return null;
          });

          return (
            <AdjustmentCard
              id={adjustment.id}
              offset={adjustment.offset}
              name={cardData()?.name}
              cardFaceItem={cardData()?.item}
            >
              <AdjustmentRecords records={adjustment.adjustment} />
            </AdjustmentCard>
          );
        }}
      </For>
    </div>
  );
};
