import { createMemo, createSignal, createUniqueId, For, Index } from "solid-js";
import { useFormContext } from "./Forms";

export const CharacterBasicFields = <T extends string>(props: {
  namePrefix: T;
}) => {
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
    </>
  );
};

export const NewItemsTab = () => {
  const { formData } = useFormContext();
  const newCharacters = () => formData("newItems.characters");
  const newActionCards = () => formData("newItems.actionCards");

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
                      formData(`newItems.characters.${idx}.id`),
                  }}
                  onClick={() =>
                    setViewingTab(
                      formData(`newItems.characters.${idx}.id`) ?? null,
                    )
                  }
                >
                  {formData(`newItems.characters.${idx}.name`)}
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
                      formData(`newItems.actionCards.${idx}.id`),
                  }}
                  onClick={() =>
                    setViewingTab(
                      formData(`newItems.actionCards.${idx}.id`) ?? null,
                    )
                  }
                >
                  {formData(`newItems.actionCards.${idx}.name`)}
                </button>
              </li>
            )}
          </Index>
          <li class="flex-grow invisible" />
          <li class="menu-title"><hr /></li>
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
        <div class="flex-grow">
          <Index each={newCharacters()}>
            {(_, idx) => (
              <div
                class="data-[shown]:flex flex-col hidden"
                bool:data-shown={
                  viewingTab() === formData(`newItems.characters.${idx}.id`)
                }
              >
                <div class="prose mb-3">
                  <h3>{formData(`newItems.characters.${idx}.name`)}</h3>
                </div>
                <div class="grid grid-cols-[6rem_1fr] gap-2">
                  <CharacterBasicFields
                    namePrefix={`newItems.characters.${idx}.`}
                  />
                </div>
              </div>
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};
