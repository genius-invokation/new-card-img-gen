import { createMemo, createSignal, createUniqueId, For, Index } from "solid-js";
import { type FormValue, useMainFormContext } from "./Forms";
import { TagsField } from "./TagsField";
import { TYPE_TAG_TEXT_MAP } from "../../constants";
import type { Language } from "../../types";
import { useFelteContext } from "./FelteFormWrapper";
import { PlayCostField } from "./PlayCostField";
import { RawDescriptionFieldProps } from "./RawDescriptionField";

export const CharacterBasicFields = <T extends string>(props: {
  namePrefix: T;
  language: Language;
}) => {
  const tags = createMemo(() =>
    Object.entries(TYPE_TAG_TEXT_MAP[props.language])
      .filter(([value]) => /^GCG_TAG_(:?NATION|CAMP|ARKHE)_/.test(value))
      .map(([value, label]) => ({ value, label })),
  );

  return (
    <>
      <label class="fieldset-legend" for={`${props.namePrefix}id`}>
        ID
      </label>
      <input
        name={`${props.namePrefix}id`}
        id={`${props.namePrefix}id`}
        type="number"
        disabled
        class="input"
      />

      <label class="fieldset-legend" for={`${props.namePrefix}name`}>
        名称
      </label>
      <input
        name={`${props.namePrefix}name`}
        id={`${props.namePrefix}name`}
        type="text"
        placeholder="雨酱"
        class="input"
      />

      <label class="fieldset-legend" for={`${props.namePrefix}hp`}>
        最大生命值
      </label>
      <input
        name={`${props.namePrefix}hp`}
        id={`${props.namePrefix}hp`}
        type="number"
        placeholder="10"
        class="input"
      />

      <label class="fieldset-legend" for={`${props.namePrefix}maxEnergy`}>
        最大能量值
      </label>
      <input
        name={`${props.namePrefix}maxEnergy`}
        id={`${props.namePrefix}maxEnergy`}
        type="number"
        placeholder="3"
        class="input"
      />

      <label class="fieldset-legend">标签</label>
      <TagsField
        name={`${props.namePrefix}tags`}
        options={tags()}
        allowsArbitrary
      />
    </>
  );
};

export const CharacterSkillFields = (props: {
  namePrefix: string;
  language: Language;
}) => {
  const skillTypes = createMemo(() =>
    Object.entries(TYPE_TAG_TEXT_MAP[props.language])
      .filter(([value]) => /^GCG_SKILL_TAG_(:?A|E|Q|PASSIVE)$/.test(value))
      .map(([value, label]) => ({ value, label })),
  );
  const { data } = useFelteContext<FormValue>();
  return (
    <>
      <div class="col-span-full flex flex-row gap-2 items-center">
        <span class="fieldset-legend">
          角色技能：{data(`${props.namePrefix}.name`)}
        </span>
        <hr class="mt-0.5 flex-grow text-neutral-400" />
      </div>
      <label class="fieldset-legend" for={`${props.namePrefix}id`}>
        ID
      </label>
      <input
        name={`${props.namePrefix}id`}
        id={`${props.namePrefix}id`}
        type="number"
        disabled
        class="input"
      />

      <div class="col-span-full flex flex-row justify-stretch gap-2">
        <div class="flex flex-col">
          <label class="label">类型</label>
          <select class="select" name={`${props.namePrefix}type`}>
            <For each={skillTypes()}>
              {(type) => <option value={type.value}>{type.label}</option>}
            </For>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="label">名称</label>
          <input class="input" name={`${props.namePrefix}name`} type="text" />
        </div>
      </div>

      <label class="fieldset-legend self-start">所需骰子</label>
      <PlayCostField name={`${props.namePrefix}playCost`} />

      <label
        class="fieldset-legend self-start"
        for={`${props.namePrefix}rawDescription`}
      >
        描述
      </label>
      <RawDescriptionFieldProps
        name={`${props.namePrefix}rawDescription`}
        id={`${props.namePrefix}rawDescription`}
      />
    </>
  );
};

export const NewItemsTab = () => {
  const { data } = useFelteContext<FormValue>();
  const newCharacters = () => data("newItems.characters");
  const newActionCards = () => data("newItems.actionCards");

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
                      viewingTab() === data(`newItems.characters.${idx}.id`),
                  }}
                  onClick={() =>
                    setViewingTab(data(`newItems.characters.${idx}.id`) ?? null)
                  }
                >
                  {data(`newItems.characters.${idx}.name`)}
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
                      viewingTab() === data(`newItems.actionCards.${idx}.id`),
                  }}
                  onClick={() =>
                    setViewingTab(
                      data(`newItems.actionCards.${idx}.id`) ?? null,
                    )
                  }
                >
                  {data(`newItems.actionCards.${idx}.name`)}
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
            {(_, idx) => (
              <div
                class="data-[shown]:flex flex-col hidden"
                bool:data-shown={
                  viewingTab() === data(`newItems.characters.${idx}.id`)
                }
              >
                <div class="prose mb-3">
                  <h3>{data(`newItems.characters.${idx}.name`)}</h3>
                </div>
                <div class="grid grid-cols-[6rem_1fr] gap-2">
                  <CharacterBasicFields
                    namePrefix={`newItems.characters.${idx}.`}
                    language={data("general.language")}
                  />
                  <Index each={data(`newItems.characters.${idx}.skills`)}>
                    {(__, skillIdx) => (
                      <CharacterSkillFields
                        namePrefix={`newItems.characters.${idx}.skills.${skillIdx}.`}
                        language={data("general.language")}
                      />
                    )}
                  </Index>
                </div>
              </div>
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};
