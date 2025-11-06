import { createMemo, createSignal, Index, Show, createEffect, createResource } from "solid-js";
import { pseudoMainFormOption, withForm } from "./shared";
import type { AdjustmentData, AdjustmentRecord, AllRawData } from "../../types";
import { useGlobalSettings } from "../../context";
import { getData } from "../../shared";
import { ADJUSTMENT_SUBJECT_LABELS, ADJUSTMENT_TYPE_LABELS } from "../../constants";

// 辅助函数：从 AllRawData 中根据 id 查找 description
const findDescriptionById = (data: AllRawData, id: number): string | null => {
  // 查找角色
  const character = data.characters.find(c => c.id === id);
  if (character) {
    // 如果是角色本身，可能没有 description，需要查找技能
    // 先检查角色的技能
    const skill = character.skills.find(s => s.id === id);
    if (skill) {
      return skill.description;
    }
    // 角色的 description 通常是空的，返回 null
    return null;
  }
  
  // 查找行动卡
  const actionCard = data.actionCards.find(c => c.id === id);
  if (actionCard) {
    return actionCard.description;
  }
  
  // 查找实体
  const entity = data.entities.find(e => e.id === id);
  if (entity) {
    // 检查是否是实体的技能
    const skill = entity.skills.find(s => s.id === id);
    if (skill) {
      return skill.description;
    }
    return entity.description;
  }
  
  // 查找所有技能（从角色和实体中）
  for (const ch of data.characters) {
    const skill = ch.skills.find(s => s.id === id);
    if (skill) {
      return skill.description;
    }
  }
  
  for (const et of data.entities) {
    const skill = et.skills.find(s => s.id === id);
    if (skill) {
      return skill.description;
    }
  }
  
  return null;
};

export const BalanceAdjustmentTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    // eslint-disable-next-line solid/reactivity
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

    // 获取 latest 版本的数据
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
                        const newId = Date.now();
                        field().pushValue({
                          id: newId,
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
                      <div class="prose flex flex-row gap-2 align-baseline items-center justify-between">
                        <h3 class="mb-0">{names()?.get(adjId() ?? 0) ?? "新增调整卡牌"}</h3>
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
                              删除此项
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
                            <field.NumberField id={`adjustments[${idx}].id`} />
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

                        <span class="col-span-full fieldset-legend text-lg">
                          调整项
                        </span>

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
                                        const handleQuery = () => {
                                          const recordId = form.useStore(
                                            (state) => state.values.adjustments[idx]?.adjustment[recordIdx]?.id
                                          )();
                                          
                                          if (recordId && typeof recordId === 'number') {
                                            // 获取当前版本的 description
                                            const currentData = allData();
                                            const currentDesc = findDescriptionById(currentData, recordId);
                                            
                                            // 获取 latest 版本的 description
                                            const latestDesc = latestData() 
                                              ? findDescriptionById(latestData()!, recordId)
                                              : null;
                                            
                                            // 填充数据
                                            if (latestDesc !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].oldData`,
                                                latestDesc
                                              );
                                            }
                                            
                                            if (currentDesc !== null) {
                                              form.setFieldValue(
                                                `adjustments[${idx}].adjustment[${recordIdx}].newData`,
                                                currentDesc
                                              );
                                            }
                                          }
                                        };
                                        
                                        return (
                                          <div class="flex gap-2">
                                            <field.NumberField
                                              id={`adjustments[${idx}].adjustment[${recordIdx}].id`}
                                              class="flex-1"
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
                                      id: Date.now(),
                                      subject: "self",
                                      type: "hp",
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

