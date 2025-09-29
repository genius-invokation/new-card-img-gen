export const GeneralConfigTab = () => {
  return (
    <div class="grid grid-cols-[max-content_1fr] gap-2">
      <label class="fieldset-legend" for="general.solo">
        ID
      </label>
      <input class="input" name="general.solo" />

      <label class="fieldset-legend" for="general.version">
        版本
      </label>
      <input class="input" name="general.version" />

      <label class="fieldset-legend" for="general.cardbackImage">
        牌背
      </label>
      <input class="input" name="general.cardbackImage" />

      <span class="fieldset-legend">语言</span>
      <div class="grid grid-cols-2 gap-2 items-center">
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="lang-en"
            name="general.language"
            value="en"
            class="radio"
          />
          <label for="lang-en">English</label>
        </div>
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="lang-zh"
            name="general.language"
            value="zh"
            class="radio"
          />
          <label for="lang-zh">中文</label>
        </div>
      </div>

      <label class="fieldset-legend" for="general.authorName">
        左下附注
      </label>
      <input class="input" name="general.authorName" />

      <label class="fieldset-legend" for="general.authorImageUrl">
        右下图片 URL
      </label>
      <input class="input" name="general.authorImageUrl" />
    </div>
  );
};
