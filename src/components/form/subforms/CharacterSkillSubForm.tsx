import { createMemo, Show } from "solid-js";
import {
  getBy,
  getSubForm,
  pseudoMainFormOption,
  type SubForm,
} from "../shared";
import { TYPE_TAG_TEXT_MAP } from "../../../constants";
import type { Language } from "../../../types";
import { PlayCostSubForm } from "./PlayCostSubForm";

interface CharacterSkillSubFormProps {
  language: Language;
  subForm: SubForm<
    typeof pseudoMainFormOption,
    `newItems.characters[${number}].skills[${number}]`
  >;
}

const SKILL_ICON_NAMES = [
  "Skill_A_00",
  "Skill_A_01",
  "Skill_A_02",
  "Skill_A_03",
  "Skill_A_04",
];

export const CharacterSkillSubForm = (props: CharacterSkillSubFormProps) => {
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
  const predefinedIcon = form.useStore((state) =>
    getBy(state.values, `${prefix}.icon`),
  );

  return (
    <>
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

      <label class="fieldset-legend">图标</label>
      <form.AppField name={`${prefix}.icon`}>
        {(field) => (
          <field.IconSelectField iconNames={SKILL_ICON_NAMES} useMask />
        )}
      </form.AppField>

      <Show when={!predefinedIcon()}>
        <label />
        <form.AppField name={`${prefix}.iconUrl`}>
          {(field) => (
            <div class="flex flex-col items-start">
              <field.ImageField id={`${prefix}.iconUrl`} />
              <span class="label">
                请使用带有透明度的图片；不透明的部分会作为图案。
              </span>
            </div>
          )}
        </form.AppField>
      </Show>

      <label class="fieldset-legend self-start">所需骰子</label>
      <PlayCostSubForm subForm={{ form, prefix: `${prefix}.playCost` }} />

      <label
        class="fieldset-legend self-start"
        for={`${prefix}.rawDescription`}
      >
        描述
      </label>
      <form.AppField name={`${prefix}.rawDescription`}>
        {(field) => <field.RawDescriptionField class="w-full" />}
      </form.AppField>
    </>
  );
};
