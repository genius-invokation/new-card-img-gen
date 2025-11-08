import { createMemo, createSignal, Index, Show, createResource } from "solid-js";
import { pseudoMainFormOption, withForm } from "./shared";
import type {
  AllRawData,
  PlayCost,
  Language,
} from "../../types";
import { useGlobalSettings } from "../../context";
import { getData } from "../../shared";
import {
  ADJUSTMENT_SUBJECT_LABELS,
  ADJUSTMENT_TYPE_LABELS,
  COST_TYPE_SPRITE_MAP,
} from "../../constants";

const findDescriptionById = (data: AllRawData, id: number): string | null => {
  const descriptionMap = new Map<number, string | null>([
    ...data.actionCards.map((card) => [card.id, card.description ?? null] as const),
    ...data.entities.flatMap((entity) => [
      [entity.id, entity.description ?? null] as const,
      ...entity.skills.map((skill) => [skill.id, skill.description ?? null] as const),
    ]),
    ...data.characters.flatMap((character) => [
      [character.id, null] as const,
      ...character.skills.map((skill) => [skill.id, skill.description ?? null] as const),
    ]),
  ]);

  return descriptionMap.get(id) ?? null;
};

const findHpById = (data: AllRawData, id: number): number | null => {
  const hpMap = new Map<number, number>(
    data.characters.map((character) => [character.id, character.hp]),
  );

  return hpMap.get(id) ?? null;
};

const findPlayCostById = (data: AllRawData, id: number): PlayCost[] | null => {
  const playCostEntries: readonly (readonly [number, PlayCost[]])[] = [
    ...data.actionCards.map((card) => [card.id, card.playCost] as const),
    ...data.characters.flatMap((character) =>
      character.skills.map((skill) => [skill.id, skill.playCost] as const),
    ),
    ...data.entities.flatMap((entity) =>
      entity.skills.map((skill) => [skill.id, skill.playCost] as const),
    ),
  ];

  const playCostMap = new Map<number, PlayCost[]>(playCostEntries);

  return playCostMap.get(id) ?? null;
};

const formatPlayCost = (playCost: PlayCost[] | null, lang: Language): string | null => {
  if (!playCost) return null;
  if (playCost.length === 0) {
    return `<b>0</b>${COST_TYPE_SPRITE_MAP["GCG_COST_DICE_SAME"]}`;
  }
  return playCost.map(({ type, count }) => `<b>${count}</b>${COST_TYPE_SPRITE_MAP[type]}`).join('');
};

export const BalanceAdjustmentTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    const form = props.form;

    const adjustments = form.useStore((state) => state.values.adjustments);
    const currentVersion = form.useStore((state) => state.values.general.version);
    const language = form.useStore((state) => state.values.general.language);

    const { allData } = useGlobalSettings();
    const names = createMemo(() => {
      const data = allData();
      return new Map(
        [...data.characters, ...data.actionCards].map((v) => [v.id, v.name]),
      );
    });

    const [latestData] = createResource(
      () => currentVersion() !== "latest" ? language() : null,
      async (lang) => {
        return await getData("latest", lang);
      }
    );

    const [currentAdjustmentIndex, setCurrentAdjustmentIndex] = createSignal<
      number | null
    >(null);

    return (
      <div class="h-full w-full @container">
        <div class="h-full w-full flex flex-col relative @md:flex-row gap-4">
          <div class="flex flex-col gap-2 flex-shrink-0">
            <ul class="menu bg-base-200 rounded-box min-h-0 overflow-auto flex-grow min-w-20 gap-1">
              <li>
                <h2 class="menu-title">调整卡牌</h2>
              </li>
              <Index each={adjustments()}>
                {(_, idx) => {
                  const adjId = form.useStore(
                    (state) => state.values.adjustments[idx]?.id,
                  );
                  return (
                    <li>
                      <button
                        type="button"
                        classList={{
                          "menu-active": currentAdjustmentIndex() === idx,
                        }}
                        onClick={() => setCurrentAdjustmentIndex(idx)}
                      >
                        {names()?.get(adjId() ?? 0) ?? "新增调整卡牌"}
                      </button>
                    </li>
                  );
                }}
              </Index>
              <form.Field name="adjustments" mode="array">
                {(field) => (
                  <li>
                    <button
                      class="btn btn-success btn-soft btn-sm"
                      type="button"
                      onClick={() => {
                        field().pushValue({
                          id: 0,
                          offset: 0,
                          adjustment: [],
                        });
                        setCurrentAdjustmentIndex(adjustments().length);
                      }}
                    >
                      新建
                    </button>
                  </li>
                )}
              </form.Field>
            </ul>
          </div>
          <div class="flex-grow overflow-auto">
            <Show when={currentAdjustmentIndex() !== null}>
              <Index each={adjustments()}>
                {(_, idx) => {
                  const adjId = form.useStore(
                    (state) => state.values.adjustments[idx]?.id,
                  );
                  const records = form.useStore(
                    (state) => state.values.adjustments[idx]?.adjustment || [],
                  );
                  return (
                    <div
                      class="data-[shown]:flex flex-col hidden gap-4"
                      bool:data-shown={currentAdjustmentIndex() === idx}
                    >
                      <div class="col-span-full flex flex-row gap-2 align-baseline items-center justify-between">
                        <h3 class="mb-0 text-lg font-bold">{names()?.get(adjId() ?? 0) ?? "新增调整卡牌"}</h3>
                        <form.Field name="adjustments" mode="array">
                          {(field) => (
                            <button
                              type="button"
                              class="btn btn-sm btn-error btn-soft"
                              onClick={() => {
                                field().removeValue(idx);
                                setCurrentAdjustmentIndex(null);
                              }}
                            >
                              删除卡牌
                            </button>
                          )}
                        </form.Field>
                      </div>
                      <div class="grid grid-cols-[6rem_1fr] gap-2">
                        <label
                          class="fieldset-legend"
                          for={`adjustments[${idx}].id`}
                        >
                          ID
                        </label>
                        <form.AppField name={`adjustments[${idx}].id`}>
                          {(field) => (
                            <field.NumberField id={`adjustments[${idx}].id`}/>
                          )}
                        </form.AppField>

                        <label
                          class="fieldset-legend"
                          for={`adjustments[${idx}].offset`}
                        >
                          偏移量
                        </label>
                        <form.AppField name={`adjustments[${idx}].offset`}>
                          {(field) => (
                            <field.NumberField
                              id={`adjustments[${idx}].offset`}
                            />
                          )}
                        </form.AppField>
                        <form.Field
                          name={`adjustments[${idx}].adjustment`}
                          mode="array"
                        >
                          {(field) => (
                            <>
                              <Index each={records()}>
                                {(_, recordIdx) => (
                                  <>
                                    <div class="col-span-full flex flex-row gap-2 items-center mt-2">
                                      <span class="text-sm font-bold">
                                        调整项 {recordIdx + 1}
                                      </span>
                                      <hr class="h-[0.5em] mt-[0.5em] flex-grow text-neutral-400" />
                                      <button
                                        type="button"
                                        class="btn btn-sm btn-square btn-soft btn-error"
                                        onClick={() => {
                                          field().removeValue(recordIdx);
                                        }}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                    <label
                                      class="fieldset-legend"
                                      for={`adjustments[${idx}].adjustment[${recordIdx}].id`}
                                    >
                                      ID
                                    </label>
                                    <form.AppField
                                      name={`adjustments[${idx}].adjustment[${recordIdx}].id`}
                                    >
                                      {(field) => {
                                        const recordIdAccessor = form.useStore(
                                          (state) =>
                                            state.values.adjustments[idx]?.adjustment[recordIdx]?.id,
                                        );
                                        const recordTypeAccessor = form.useStore(
                                          (state) =>
                                            state.values.adjustments[idx]?.adjustment[recordIdx]?.type,
                                        );

                                        const handleQuery = () => {
                                          const recordId = recordIdAccessor();
                                          const recordType = recordTypeAccessor();

                                          if (!recordId || typeof recordId !== "number") {
                                            return;
                                          }

                                          const lang = language();
                                          const currentData = allData();
                                          const latest = latestData();

                                          let handled = false;

                                          if (recordType === "hp") {
                                            const currentHp = findHpById(currentData, recordId);
                                            const latestHp = latest ? findHpById(latest, recordId) : null;

                                            if (latestHp !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].oldData`,
                                                `<b>${latestHp}</b>`,
                                              );
                                              handled = true;
                                            }

                                            if (currentHp !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].newData`,
                                                `<b>${currentHp}</b>`,
                                              );
                                              handled = true;
                                            }
                                          } else if (recordType === "cost") {
                                            const currentCost = formatPlayCost(
                                              findPlayCostById(currentData, recordId),
                                              lang,
                                            );
                                            const latestCost = latest
                                              ? formatPlayCost(findPlayCostById(latest, recordId), lang)
                                              : null;

                                            if (latestCost !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].oldData`,
                                                latestCost,
                                              );
                                              handled = true;
                                            }

                                            if (currentCost !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].newData`,
                                                currentCost,
                                              );
                                              handled = true;
                                            }
                                          }

                                          if (handled) {
                                            return;
                                          }

                                          const currentDesc = findDescriptionById(currentData, recordId);
                                          const latestDesc = latest
                                            ? findDescriptionById(latest, recordId)
                                            : null;

                                          if (latestDesc !== null) {
                                            form.setFieldValue(
                                              `adjustments[${idx}].adjustment[${recordIdx}].oldData`,
                                              latestDesc,
                                            );
                                          }

                                          if (currentDesc !== null) {
                                            form.setFieldValue(
                                              `adjustments[${idx}].adjustment[${recordIdx}].newData`,
                                              currentDesc,
                                            );
                                          }
                                        };

                                        return (
                                          <div class="flex gap-2">
                                            <field.NumberField
                                              id={`adjustments[${idx}].adjustment[${recordIdx}].id`}
                                            />
                                            <button
                                              type="button"
                                              class="btn btn-sm btn-ghost h-full"
                                              onClick={handleQuery}
                                              title="填充description"
                                            >
                                              填充
                                            </button>
                                          </div>
                                        );
                                      }}
                                    </form.AppField>

                                    <label
                                      class="fieldset-legend"
                                      for={`adjustments[${idx}].adjustment[${recordIdx}].subject`}
                                    >
                                      类型
                                    </label>
                                    <form.AppField
                                      name={`adjustments[${idx}].adjustment[${recordIdx}].subject`}
                                    >
                                      {(field) => (
                                        <field.SelectField
                                          id={`adjustments[${idx}].adjustment[${recordIdx}].subject`}
                                          options={Object.entries(ADJUSTMENT_SUBJECT_LABELS.CHS).map(([value, label]) => ({
                                            value,
                                            label,
                                          }))}
                                        />
                                      )}
                                    </form.AppField>

                                    <label
                                      class="fieldset-legend"
                                      for={`adjustments[${idx}].adjustment[${recordIdx}].type`}
                                    >
                                      改动内容
                                    </label>
                                    <form.AppField
                                      name={`adjustments[${idx}].adjustment[${recordIdx}].type`}
                                    >
                                      {(field) => (
                                        <field.SelectField
                                          id={`adjustments[${idx}].adjustment[${recordIdx}].type`}
                                          options={Object.entries(ADJUSTMENT_TYPE_LABELS.CHS).map(([value, label]) => ({
                                            value,
                                            label,
                                          }))}
                                        />
                                      )}
                                    </form.AppField>

                                    <label
                                      class="fieldset-legend"
                                      for={`adjustments[${idx}].adjustment[${recordIdx}].oldData`}
                                    >
                                      旧数据
                                    </label>
                                    <form.AppField
                                      name={`adjustments[${idx}].adjustment[${recordIdx}].oldData`}
                                    >
                                      {(field) => (
                                        <field.TextAreaField
                                          id={`adjustments[${idx}].adjustment[${recordIdx}].oldData`}
                                          class="h-16"
                                        />
                                      )}
                                    </form.AppField>

                                    <label
                                      class="fieldset-legend"
                                      for={`adjustments[${idx}].adjustment[${recordIdx}].newData`}
                                    >
                                      新数据
                                    </label>
                                    <form.AppField
                                      name={`adjustments[${idx}].adjustment[${recordIdx}].newData`}
                                    >
                                      {(field) => (
                                        <field.TextAreaField
                                          id={`adjustments[${idx}].adjustment[${recordIdx}].newData`}
                                          class="h-16"
                                        />
                                      )}
                                    </form.AppField>
                                  </>
                                )}
                              </Index>
                              <div class="col-span-full">
                                <button
                                  class="btn btn-success btn-soft btn-sm w-full"
                                  type="button"
                                  onClick={() => {
                                    field().pushValue({
                                      id: adjId() ?? 0,
                                      subject: "self",
                                      type: "effect",
                                      oldData: "",
                                      newData: "",
                                    });
                                  }}
                                >
                                  添加调整项
                                </button>
                              </div>
                            </>
                          )}
                        </form.Field>
                      </div>
                    </div>
                  );
                }}
              </Index>
            </Show>
          </div>
        </div>
      </div>
    );
  },
});

