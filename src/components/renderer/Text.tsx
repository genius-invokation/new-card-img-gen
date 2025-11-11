import { Show, For, createMemo } from "solid-js";
import { useGlobalSettings } from "../../context";
import "./Text.css";

export const Text = (props: { text: string | undefined | null }) => {
  const { language } = useGlobalSettings();
  return (
    <Show when={props.text}>
      {(text) => (
        <Show
          when={["CHS", "CHT"].includes(language())}
          fallback={<English text={text()} />}
        >
          <Chinese text={text()} />
        </Show>
      )}
    </Show>
  );
};

const Chinese = (props: { text: string }) => {
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

const English = (props: { text: string }) => {
  const segments = createMemo(() => {
    const result: string[] = [];
    for (const part of props.text.split(/(\s+)/)) {
      if (part === "") continue;
      result.push(part);
    }
    return result;
  });

  return (
    <For each={segments()}>
      {(segment) => (
        <Show 
          when={/^\s+$/.test(segment)}
          fallback={<span class="english-word">{segment}</span>}
        >
          <span class="english-space" />
        </Show>
      )}
    </For>
  );
};
