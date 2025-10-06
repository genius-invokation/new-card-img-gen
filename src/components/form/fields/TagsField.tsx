import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  on,
} from "solid-js";
import type { SelectOption } from "./SelectField";
import { useFieldContext } from "../shared";

interface TagsFieldProps {
  class?: string;
  options: SelectOption[];
  allowsArbitrary?: boolean;
}

export default function TagsField(props: TagsFieldProps) {
  const field = useFieldContext<string[]>();

  const tags = () => field().state.value;
  const setTags = (updater: (prev: string[]) => string[]) => {
    field().handleChange(updater);
  };

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
        const newTags = parts
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
                &times;
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
