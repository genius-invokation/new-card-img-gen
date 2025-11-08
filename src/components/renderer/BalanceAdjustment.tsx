import { For, Show, createMemo, type JSX } from "solid-js";
import type { AdjustmentData, AdjustmentRecord } from "../../types";
import { useGlobalSettings } from "../../context";
import { Text } from "./Text";
import { cardFaceUrl, tagImageUrl } from "../../utils";
import { DESCRIPTION_ICON_IMAGES, ADJUSTMENT_SUBJECT_LABELS, ADJUSTMENT_TYPE_LABELS } from "../../constants";
import "./BalanceAdjustment.css";
import { BLOCK_CARD_MASK, NEW_SIGN_CHS, NEW_SIGN_EN, OLD_SIGN_CHS, OLD_SIGN_EN } from "../../constants";

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
            top: `${props.offset - 0.25}rem`,
            "mask-image": `url("${BLOCK_CARD_MASK}")`,
            "mask-size": "cover",
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
        <span class="record-text-light">
          <Text text={text.substring(currentIndex, match.index)} />
        </span>
      );
    }

    // 处理匹配的内容
    if (match[0].startsWith('<b>')) {
      // 处理 <b></b> 标签
      const boldText = match[0].replace(/<\/?b>/g, '');
      parts.push(
        <span class="record-text-bold">
          <Text text={boldText} />
        </span>
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

interface AdjustmentRecordProps {
  record: AdjustmentRecord;
}

const AdjustmentRecord = (props: AdjustmentRecordProps) => {
  const isInlineType = (type: string) => type === "hp" || type === "cost";
  const { allData, language } = useGlobalSettings();
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

  const lang = language();
  const recordName = createMemo(() => lang === "CHS" ? `「${names()?.get(props.record.id)}」` : ` "${names()?.get(props.record.id)}" `);
  const subjectLabel = ADJUSTMENT_SUBJECT_LABELS[lang][props.record.subject] || props.record.subject;
  const typeLabel = ADJUSTMENT_TYPE_LABELS[lang][props.record.type] || props.record.type;
  const adjustmentText = lang === "CHS" ? "调整：" : " adjustment:";
  const oldSign = lang === "CHS" ? OLD_SIGN_CHS : OLD_SIGN_EN;
  const newSign = lang === "CHS" ? NEW_SIGN_CHS : NEW_SIGN_EN;
  const title = props.record.subject === "self"
    ? `${typeLabel}${adjustmentText}`
    : `${subjectLabel}${recordName()}${typeLabel}${adjustmentText}`;
  const isInline = isInlineType(props.record.type);

  return (
    <div class="adjustment-record">
      <div class="record-title">{title}</div>
      <Show when={isInline} fallback={
        <>
          <div class="record-block">
            <img src={oldSign} class="record-sign" />
            <div class="record-content">{parseRichText(props.record.oldData)}</div>
          </div>
          <div class="record-block">
            <img src={newSign} class="record-sign" />
            <div class="record-content">{parseRichText(props.record.newData)}</div>
          </div>
        </>
      }>
        <div class="record-inline">
          <img src={oldSign} class="record-sign" style={{ "transform": "translateY(-0.15rem)" }} />
          <div class="record-content">{parseRichText(props.record.oldData)}</div>
          <span class="record-arrow">→</span>
          <img src={newSign} class="record-sign" style={{ "transform": "translateY(-0.15rem)" }} />
          <div class="record-content">{parseRichText(props.record.newData)}</div>
        </div>
      </Show>
    </div>
  );
};

export const BalanceAdjustment = (props: BalanceAdjustmentProps) => {
  const { allData, displayId } = useGlobalSettings();
  const processedAdjustments = createMemo(() => {
    const data = allData();

    const resolveCardData = (id: number) => {
      const character = data.characters.find((c) => c.id === id);
      if (character) {
        return {
          name: character.name,
          cardFace: character.cardFace,
          item: character,
        };
      }
      const actionCard = data.actionCards.find((c) => c.id === id);
      if (actionCard) {
        return {
          name: actionCard.name,
          cardFace: actionCard.cardFace,
          item: actionCard,
          isLegend: actionCard.tags.includes("GCG_TAG_LEGEND"),
        };
      }
      return null;
    };

    return props.adjustments.map((adjustment) => ({
      adjustment,
      cardData: resolveCardData(adjustment.id),
    }));
  });

  return (
    <div class="balance-adjustment">
      <For each={processedAdjustments()}>
        {(item) => (
          <AdjustmentCard
            id={item.adjustment.id}
            offset={item.adjustment.offset}
            name={item.cardData?.name}
            cardFaceItem={item.cardData?.item}
          >
            <div class="adjustment-records">
              <For each={item.adjustment.adjustment}>
                {(record) => <AdjustmentRecord record={record} />}
              </For>
            </div>
          </AdjustmentCard>
        )}
      </For>
    </div>
  );
};
