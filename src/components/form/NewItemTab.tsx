import { createMemo, Index } from "solid-js";
import { useFormContext } from "./Forms";
import { For } from "solid-js";

export const CharacterBasicFields = <T extends string>(props: {
  namePrefix: T;
}) => {
  return (
    <>
      <input
        name={`${props.namePrefix}id`}
        type="number"
        placeholder="ID"
        class="input"
      />
      <input
        name={`${props.namePrefix}name`}
        type="text"
        placeholder="名称"
        class="input"
      />
      <input
        name={`${props.namePrefix}hp`}
        type="number"
        placeholder="最大生命值"
        class="input"
      />
      <input
        name={`${props.namePrefix}maxEnergy`}
        type="number"
        placeholder="最大能量值"
        class="input"
      />
    </>
  );
};

export const NewItemsTab = () => {
  const { formData } = useFormContext();
  const newCharacters = createMemo(() => formData("newItems.characters"));
  return (
    <>
      <Index each={newCharacters()}>
        {(_, idx) => (
          <CharacterBasicFields namePrefix={`newItems.characters.${idx}.`} />
        )}
      </Index>
    </>
  );
};
