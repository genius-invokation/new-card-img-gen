import { createMemo } from "solid-js";
import { useGlobalSettings } from "../../context";
import { useFormContext } from "./Forms";

export const GeneralConfigTab = () => {
  const { allData } = useGlobalSettings();
  const { formData } = useFormContext();

  const names = createMemo(() => {
    const data = allData();
    console.log("Computed");
    return new Map(
      [...data.characters, ...data.actionCards].map((v) => [v.id, v.name]),
    );
  });

  const isCharacterMode = createMemo(
    () => formData().general.mode === "character",
  );
  const isSingleActionCardMode = createMemo(
    () => formData().general.mode === "singleActionCard",
  );
  const isVersionedActionCardsMode = createMemo(
    () => formData().general.mode === "versionedActionCards",
  );

  return (
    <div class="grid grid-cols-[max-content_1fr] gap-2">
      <span class="fieldset-legend">模式</span>
      <div class="tabs tabs-box w-fit">
        <label class="tab has-checked:tab-active">
          <input type="radio" name="general.mode" value="character" hidden />
          角色卡
        </label>
        <label class="tab has-checked:tab-active">
          <input
            type="radio"
            name="general.mode"
            value="singleActionCard"
            hidden
          />
          行动卡
        </label>
        <label class="tab has-checked:tab-active">
          <input
            type="radio"
            name="general.mode"
            value="versionedActionCards"
          />
          版本新增行动卡
        </label>
      </div>

      <label
        class="fieldset-legend"
        classList={{ hidden: !isCharacterMode() }}
        for="general.characterId"
      >
        ID
      </label>
      <label class="input" classList={{ hidden: !isCharacterMode() }}>
        <input
          class="grow"
          id="general.characterId"
          name="general.characterId"
          placeholder="1503"
          type="number"
        />
        <span class="label shrink-0 max-w-[50%] overflow-clip">
          {names().get(formData().general.characterId ?? 0)}
        </span>
      </label>

      <label
        class="fieldset-legend"
        classList={{ hidden: !isSingleActionCardMode() }}
        for="general.characterId"
      >
        ID
      </label>
      <label class="input" classList={{ hidden: !isSingleActionCardMode() }}>
        <input
          class="grow"
          id="general.actionCardId"
          name="general.actionCardId"
          placeholder="332005"
          type="number"
        />
        <span class="label shrink-0 max-w-[50%] overflow-clip">
          {names().get(formData().general.actionCardId ?? 0)}
        </span>
      </label>

      <label
        class="fieldset-legend"
        classList={{ hidden: !isVersionedActionCardsMode() }}
        for="general.version"
      >
        版本
      </label>
      <input
        class="input"
        classList={{ hidden: !isVersionedActionCardsMode() }}
        id="general.version"
        name="general.version"
        placeholder="v6.0.0"
        pattern="v\d+\.\d+\.\d+(-beta)?"
      />

      <label class="fieldset-legend" for="general.cardbackImage">
        牌背
      </label>
      <input
        class="input"
        id="general.cardbackImage"
        name="general.cardbackImage"
      />

      <span class="fieldset-legend">语言</span>
      <div class="flex flex-row gap-8 items-center">
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="general.language.zh"
            name="general.language"
            value="zh"
            class="radio"
          />
          <label for="general.language.zh">中文</label>
        </div>
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="general.language.en"
            name="general.language"
            value="en"
            class="radio"
          />
          <label for="general.language.en">English</label>
        </div>
      </div>

      <label class="fieldset-legend" for="general.authorName">
        左下附注
      </label>
      <input class="input" id="general.authorName" name="general.authorName" />

      <label class="fieldset-legend" for="general.authorImageUrl">
        右下图片 URL
      </label>
      <input
        class="input"
        id="general.authorImageUrl"
        name="general.authorImageUrl"
      />

      <label class="fieldset-legend" for="general.displayId">
        显示 ID
      </label>
      <input
        type="checkbox"
        class="toggle toggle-secondary self-center"
        id="general.displayId"
        name="general.displayId"
      />

      <label class="fieldset-legend" for="general.displayStory">
        显示角色故事
      </label>
      <input
        type="checkbox"
        class="toggle toggle-secondary self-center"
        id="general.displayStory"
        name="general.displayStory"
      />
    </div>
  );
};
