import { Show, For, createEffect } from "solid-js";
import { useAppContext } from "../context/appContext";

export const Text = (props: { text: string | undefined | null }) => {
  const { language } = useAppContext();
  return (
    <Show when={props.text}>
      {(text) => (
        <Show
          when={language === "zh"}
          fallback={<span class="english-text">{text()}</span>}
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
