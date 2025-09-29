export const DataSourceTab = () => {
  return (
    <fieldset class="fieldset">
      <legend class="fieldset-legend">数据源</legend>
      <textarea
        class="textarea h-36 w-full font-mono"
        readonly
        name="dataSource"
      />
      <div class="label w-full font-mono whitespace-pre-wrap">
        {`获取数据的异步 JS 函数体，暂不支持前端修改。
参数 name: "characters" | "action_cards" | "entities" | "keywords"`}
      </div>
    </fieldset>
  );
};
