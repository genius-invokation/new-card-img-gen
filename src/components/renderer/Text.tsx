import { Show, For, createMemo, Switch, Match } from "solid-js";
import { useGlobalSettings } from "../../context";
import "./Text.css";

export const Text = (props: { text: string | undefined | null }) => {
  const { language } = useGlobalSettings();
  return (
    <Show when={props.text}>
      {(text) => (
        <Switch>
          <Match when={["CHS", "CHT", "JP", "KR"].includes(language())}>
            <CJK text={text()} />
          </Match>
          <Match when={true}>
            <Latin text={text()} />
          </Match>
        </Switch>
      )}
    </Show>
  );
};

const CJK = (props: { text: string }) => {
  const parts = () => props.text.split("·");
  return (
    <For each={parts()}>
      {(part, i) => (
        <>
          {part}
          <Show when={i() < parts().length - 1}>
            <span class="middot">·</span>
          </Show>
        </>
      )}
    </For>
  );
};

const Latin = (props: { text: string }) => {
  const SPACE: unique symbol = Symbol("space");
  const segments = createMemo(() => {
    return props.text
      .split(/(\s+)/)
      .filter((part) => part)
      .map((part) => (part.trim() ? part : SPACE));
  });

  return (
    <>
      <For each={segments()}>
        {(segment) => (
          <Show when={typeof segment === "string"} fallback={" "}>
            <span class="latin-word">{segment as string}</span>
          </Show>
        )}
      </For>
    </>
  );
};
