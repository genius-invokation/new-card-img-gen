import { createMemo, createSignal, createUniqueId, For, Index } from "solid-js";
import { TYPE_TAG_TEXT_MAP } from "../../constants";
import type { Language } from "../../types";
import { PlayCostSubForm } from "./subforms/PlayCostSubForm";
import {
  getSubForm,
  pseudoMainFormOption,
  withForm,
  type SubForm,
  getBy,
} from "./shared";

interface CharacterBasicFieldsProps {
  language: Language;
  subForm: SubForm<
    typeof pseudoMainFormOption,
    `newItems.characters[${number}]`
  >;
}

export const CharacterBasicFields = (props: CharacterBasicFieldsProps) => {
  // eslint-disable-next-line solid/reactivity
  const subForm = props.subForm;

  const prefix = subForm.prefix;
  const form = getSubForm(subForm);

  const tags = createMemo(() =>
    Object.entries(TYPE_TAG_TEXT_MAP[props.language])
      .filter(([value]) => /^GCG_TAG_(:?NATION|CAMP|ARKHE)_/.test(value))
      .map(([value, label]) => ({ value, label })),
  );

  const characterId = form.useStore((state) =>
    getBy(state.values, `${prefix}.id`),
  );

  return (
    <>
      <label class="fieldset-legend">ID</label>
      <input type="number" readOnly class="input" value={characterId()} />

      <label class="fieldset-legend" for={`${prefix}.name`}>
        名称
      </label>
      <form.AppField name={`${prefix}.name`}>
        {(field) => (
          <field.TextField id={`${prefix}.name`} placeholder="雨酱" />
        )}
      </form.AppField>

      <label class="fieldset-legend" for={`${prefix}.hp`}>
        最大生命值
      </label>
      <form.AppField name={`${prefix}.hp`}>
        {(field) => <field.NumberField id={`${prefix}.hp`} placeholder="10" />}
      </form.AppField>

      <label class="fieldset-legend" for={`${prefix}.maxEnergy`}>
        最大能量值
      </label>
      <form.AppField name={`${prefix}.maxEnergy`}>
        {(field) => (
          <field.NumberField id={`${prefix}.maxEnergy`} placeholder="3" />
        )}
      </form.AppField>

      <label class="fieldset-legend">标签</label>
      <form.AppField name={`${prefix}.tags`}>
        {(field) => <field.TagsField options={tags()} allowsArbitrary />}
      </form.AppField>
    </>
  );
};

interface CharacterSkillFieldsProps {
  language: Language;
  subForm: SubForm<
    typeof pseudoMainFormOption,
    `newItems.characters[${number}].skills[${number}]`
  >;
}

export const CharacterSkillFields = (props: CharacterSkillFieldsProps) => {
  // eslint-disable-next-line solid/reactivity
  const subForm = props.subForm;

  const prefix = subForm.prefix;
  const form = getSubForm(subForm);

  const skillTypes = createMemo(() =>
    Object.entries(TYPE_TAG_TEXT_MAP[props.language])
      .filter(([value]) => /^GCG_SKILL_TAG_(:?A|E|Q|PASSIVE)$/.test(value))
      .map(([value, label]) => ({ value, label })),
  );

  const skillId = form.useStore((state) => getBy(state.values, `${prefix}.id`));
  const skillName = form.useStore((state) =>
    getBy(state.values, `${prefix}.name`),
  );

  return (
    <>
      <div class="col-span-full flex flex-row gap-2 items-center">
        <span class="fieldset-legend">角色技能：{skillName()}</span>
        <hr class="mt-0.5 flex-grow text-neutral-400" />
      </div>
      <label class="fieldset-legend">ID</label>
      <input type="number" readOnly class="input" value={skillId()} />

      <div class="col-span-full flex flex-row justify-stretch gap-2">
        <div class="flex flex-col">
          <label class="label">类型</label>
          <form.AppField name={`${prefix}.type`}>
            {(field) => <field.SelectField options={skillTypes()} />}
          </form.AppField>
        </div>
        <div class="flex flex-col">
          <label class="label">名称</label>
          <form.AppField name={`${prefix}.name`}>
            {(field) => <field.TextField placeholder="技能名称" />}
          </form.AppField>
        </div>
      </div>

      <label class="fieldset-legend self-start">所需骰子</label>
      <PlayCostSubForm subForm={{ form, prefix: `${prefix}.playCost` }} />

      <label
        class="fieldset-legend self-start"
        for={`${prefix}.rawDescription`}
      >
        描述
      </label>
      <form.AppField name={`${prefix}.rawDescription`}>
        {(field) => <field.RawDescriptionField />}
      </form.AppField>
    </>
  );
};

export const NewItemsTab = withForm({
  ...pseudoMainFormOption,
  render: (props) => {
    // eslint-disable-next-line solid/reactivity
    const form = props.form;

    const language = form.useStore((state) => state.values.general.language);
    const newCharacters = form.useStore(
      (state) => state.values.newItems.characters,
    );
    const newActionCards = form.useStore(
      (state) => state.values.newItems.actionCards,
    );

    const [viewingTab, setViewingTab] = createSignal<number | "extra" | null>(
      null,
    );
    const menuMobileVisible = createUniqueId();

    return (
      <div class="h-full w-full @container">
        <div class="h-full w-full flex flex-col relative @md:flex-row gap-4">
          <input id={menuMobileVisible} type="checkbox" hidden class="peer" />
          <label
            for={menuMobileVisible}
            class="self-start @md:hidden peer-checked:invisible btn btn-soft"
          >
            &gt;
          </label>
          <ul class="hidden absolute h-full @md:flex peer-checked:flex @md:relative menu bg-base-200 rounded-box min-w-20 flex-shrink-0 flex-nowrap min-h-0 overflow-auto">
            <li class="@md:hidden">
              <label for={menuMobileVisible}>&lt;</label>
            </li>
            <li>
              <h2 class="menu-title">新角色</h2>
            </li>
            <Index each={newCharacters()}>
              {(_, idx) => (
                <li>
                  <button
                    type="button"
                    classList={{
                      "menu-active":
                        viewingTab() ===
                        form.getFieldValue(`newItems.characters[${idx}].id`),
                    }}
                    onClick={() =>
                      setViewingTab(
                        form.getFieldValue(`newItems.characters[${idx}].id`) ??
                          null,
                      )
                    }
                  >
                    {form.getFieldValue(`newItems.characters[${idx}].name`)}
                  </button>
                </li>
              )}
            </Index>
            <li>
              <h2 class="menu-title">新行动卡</h2>
            </li>
            <Index each={newCharacters()}>
              {(_, idx) => (
                <li>
                  <button
                    type="button"
                    classList={{
                      "menu-active":
                        viewingTab() ===
                        form.getFieldValue(`newItems.actionCards[${idx}].id`),
                    }}
                    onClick={() =>
                      setViewingTab(
                        form.getFieldValue(`newItems.actionCards[${idx}].id`) ??
                          null,
                      )
                    }
                  >
                    {form.getFieldValue(`newItems.actionCards[${idx}].name`)}
                  </button>
                </li>
              )}
            </Index>
            <li class="flex-grow invisible" />
            <li class="menu-title">
              <hr />
            </li>
            <li>
              <button
                type="button"
                classList={{
                  "menu-active": viewingTab() === "extra",
                }}
                onClick={() => setViewingTab("extra")}
              >
                新衍生物
              </button>
            </li>
          </ul>
          <div class="flex-grow overflow-auto">
            <Index each={newCharacters()}>
              {(_, idx) => {
                const id = form.useStore(
                  (state) => state.values.newItems.characters[idx].id,
                );
                const name = form.useStore(
                  (state) => state.values.newItems.characters[idx].name,
                );
                const skills = form.useStore(
                  (state) => state.values.newItems.characters[idx].skills,
                );
                return (
                  <div
                    class="data-[shown]:flex flex-col hidden"
                    bool:data-shown={viewingTab() === id()}
                  >
                    <div class="prose mb-3">
                      <h3>{name()}</h3>
                    </div>
                    <div class="grid grid-cols-[6rem_1fr] gap-2">
                      <CharacterBasicFields
                        subForm={{
                          form,
                          prefix: `newItems.characters[${idx}]`,
                        }}
                        language={language()}
                      />
                      <Index each={skills()}>
                        {(__, skillIdx) => (
                          <CharacterSkillFields
                            subForm={{
                              form,
                              prefix: `newItems.characters[${idx}].skills[${skillIdx}]`,
                            }}
                            language={language()}
                          />
                        )}
                      </Index>
                    </div>
                  </div>
                );
              }}
            </Index>
          </div>
        </div>
      </div>
    );
  },
});
