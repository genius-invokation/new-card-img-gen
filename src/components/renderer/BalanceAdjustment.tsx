import { For, Show, createMemo, type JSX } from "solid-js";
import type { AdjustmentData, AdjustmentRecord } from "../../types";
import { useGlobalSettings } from "../../context";
import { Text } from "./Text";
import { cardFaceUrl } from "../../utils";
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

const AdjustmentRecords = (props: { records: AdjustmentRecord[] }) => {
  return (
    <div class="adjustment-records">
      <For each={props.records}>
        {(record) => (
          <div class="adjustment-record">
            <div class="record-header">
              <span class="record-id">ID: {record.id}</span>
              <span class="record-subject">{getSubjectLabel(record.subject)}</span>
              <span class="record-type">{getTypeLabel(record.type)}</span>
            </div>
            <div class="record-comparison">
              <div class="record-old">
                <span class="record-label">旧数据:</span>
                <span class="record-data">{record.oldData}</span>
              </div>
              <div class="record-arrow">→</div>
              <div class="record-new">
                <span class="record-label">新数据:</span>
                <span class="record-data">{record.newData}</span>
              </div>
            </div>
          </div>
        )}
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

function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    self: "自身",
    normalAttack: "普通攻击",
    elementalSkill: "元素战技",
    elementalBurst: "元素爆发",
    passiveSkill: "被动技能",
    talent: "天赋",
    technique: "秘传",
    summon: "召唤物",
    status: "状态",
    combatStatus: "出战状态",
    relatedCard: "关联卡牌",
  };
  return labels[subject] || subject;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hp: "生命值",
    cost: "费用",
    effect: "效果",
    damage: "伤害",
    usage: "可用次数",
    duration: "持续回合",
  };
  return labels[type] || type;
}

