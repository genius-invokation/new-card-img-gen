import { Show, For } from "solid-js";
import { useAppContext } from "../context/appContext";

export const Text = (props: { text: string | undefined | null }) => {
  const { language = "zh" } = useAppContext();
  const get = () => props.text;
  return (
    <Show when={get()} fallback={<></>}>
      <Show
        when={language === "en"}
        fallback={<Chinese text={get() as string} />}
      >
        <span class="english-text">{get()}</span>
      </Show>
    </Show>
  );
};

const Chinese = (props: { text: string }) => {
  const parts = () =>
    props.text.includes("·") ? props.text.split("·") : ([] as string[]);
  return (
    <>
      {parts().length === 0 ? (
        <>{props.text}</>
      ) : (
        <For each={parts()}>
          {(part, i) => (
            <>
              {part}
              {i() < parts().length - 1 && <span class="middot">·</span>}
            </>
          )}
        </For>
      )}
    </>
  );
};
