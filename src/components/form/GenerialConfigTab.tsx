export const GeneralConfigTab = () => {
  return (
    <div class="grid grid-cols-[max-content_1fr] gap-2">
      <label class="fieldset-legend" for="solo">
        Solo ID
      </label>
      <input class="input" name="solo" placeholder="Solo ID" />

      <label class="fieldset-legend" for="version">
        Version
      </label>
      <input class="input" name="version" placeholder="Version" />

      <label class="fieldset-legend" for="cardbackImage">
        Cardback Image
      </label>
      <input class="input" name="cardbackImage" />

      <span class="fieldset-legend">Language</span>
      <div class="grid grid-cols-2 gap-2 items-center">
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="lang-en"
            name="language"
            value="en"
            class="radio"
          />
          <label for="lang-en">English</label>
        </div>
        <div class="flex flex-row items-center gap-2">
          <input
            type="radio"
            id="lang-zh"
            name="language"
            value="zh"
            class="radio"
          />
          <label for="lang-zh">中文</label>
        </div>
      </div>

      <label class="fieldset-legend" for="authorName">
        Author Name
      </label>
      <input class="input" name="authorName" />

      <label class="fieldset-legend" for="authorImageUrl">
        Author Image URL
      </label>
      <input class="input" name="authorImageUrl" />
    </div>
  );
};
