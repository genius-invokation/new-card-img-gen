import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  on,
  untrack,
} from "solid-js";
import { createFieldBindings, useFelteContext } from "./FelteFormWrapper";
import * as R from "remeda";

interface TagOption {
  value: string;
  label: string;
}

interface TagsFieldProps {
  class?: string;
  name: string;
  options: TagOption[];
  allowsArbitrary?: boolean;
}

export const TagsField = (props: TagsFieldProps) => {
  // eslint-disable-next-line solid/reactivity
  const name = props.name;

  const { data, setFields } = useFelteContext();
  const outerDataValue = createMemo(() => data(name) as string[]);

  const [tags, setTags] = createSignal<string[]>([]);

  const [inputValue, setInputValue] = createSignal("");

  const valueToLabelMap = createMemo(
    () =>
      new Map(props.options.map(({ value, label }) => [value, label] as const)),
  );
  const labelToValueMap = createMemo(
    () =>
      new Map(props.options.map(({ value, label }) => [label, value] as const)),
  );

  const dataListId = createUniqueId();

  createEffect(
    on(inputValue, (value) => {
      const parts = value.split(/[\s]/).map((p) => p.trim());
      const allowsArbitrary = props.allowsArbitrary;
      if (parts.length > 1) {
        const lastPart = parts.pop()!;
        let newTags = parts
          .map(
            (part) =>
              labelToValueMap().get(part) ?? (allowsArbitrary ? part : null),
          )
          .filter((v): v is string => !!v && !tags().includes(v));
        if (newTags.length > 0) {
          setTags((prev) => [...prev, ...newTags]);
        }
        setInputValue(lastPart);
      }
    }),
  );

  createFieldBindings(name, tags, setTags, {
    equal: R.isShallowEqual,
  });

  return (
    <div
      class={`input h-auto gap-0 flex flex-row items-center flex-wrap ${
        props.class || ""
      }`}
    >
      <For each={tags()}>
        {(tag) => (
          <div class="h-[var(--size)] inline-flex flex-row items-center mr-2">
            <div
              class="badge badge-soft badge-secondary data-custom:badge-neutral flex-shrink-0 flex-grow-0"
              bool:data-custom={!valueToLabelMap().has(tag)}
            >
              {valueToLabelMap().get(tag) ?? tag}
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                class="cursor-pointer select-none"
              >
                &cross;
              </button>
            </div>
          </div>
        )}
      </For>
      <input
        type="text"
        class="flex-grow w-10 h-[var(--size)]"
        placeholder="Add a tag"
        value={inputValue()}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            setInputValue((value) => value + " "); // trigger onInput
          }
          if (e.key === "Backspace" && !e.currentTarget.value) {
            setTags((prev) => prev.slice(0, -1));
          }
        }}
        list={dataListId}
      />
      <datalist id={dataListId}>
        <For each={props.options}>
          {(option) => <option value={option.label + " "} />}
        </For>
      </datalist>
    </div>
  );
};
