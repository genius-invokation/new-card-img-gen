import { createMemo } from "solid-js";
import { getBy, getSubForm, pseudoMainFormOption, type SubForm } from "../shared";
import { TYPE_TAG_TEXT_MAP } from "../../../constants";
import type { Language } from "../../../types";

interface CharacterBasicSubFormProps {
  language: Language;
  subForm: SubForm<
    typeof pseudoMainFormOption,
    `newItems.characters[${number}]`
  >;
}

export const CharacterBasicSubForm = (props: CharacterBasicSubFormProps) => {
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
