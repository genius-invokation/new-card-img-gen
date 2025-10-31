import { For, Show } from "solid-js";
import type { AdjustmentData } from "../../types";
import "./BalanceAdjustment.css";

export interface BalanceAdjustmentProps {
  adjustments: AdjustmentData[];
}

export const BalanceAdjustment = (props: BalanceAdjustmentProps) => {
  return (
    <div class="balance-adjustment">
      <For each={props.adjustments}>
        {(adjustment) => (
          <div class="adjustment-card">
            <div class="adjustment-header">
              <h3 class="adjustment-title">调整 #{adjustment.id}</h3>
              <Show when={adjustment.offset !== 0}>
                <span class="adjustment-offset">偏移: {adjustment.offset}</span>
              </Show>
            </div>
            <div class="adjustment-records">
              <For each={adjustment.adjustment}>
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
          </div>
        )}
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

