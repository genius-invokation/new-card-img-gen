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
  const leadingSpace = () => /^\s+/.test(props.text);
  const trailingSpace = () => /\s+$/.test(props.text);
  const segments = createMemo(() =>
    props.text.split(/\s+/).filter((seg) => seg),
  );

  return (
    <>
      <Show when={leadingSpace()}> </Show>
      <For each={segments()}>
        {(segment, i) => (
          <>
            {i() > 0 && " "}
            <span class="latin-word">{segment}</span>
          </>
        )}
      </For>
      <Show when={trailingSpace()}> </Show>
    </>
  );
};
