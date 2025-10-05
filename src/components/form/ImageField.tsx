import { createField } from "@felte/solid";
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  Show,
  untrack,
  type JSX,
} from "solid-js";
import { useMainFormContext } from "./Forms";
import { createFieldBindings, useFelteContext } from "./FelteFormWrapper";

export interface ImageFieldProps {
  name: string;
}

/**
 * A component that act like a string field, but accept whether:
 * - An URL points to a image;
 * - or a data URI, uploaded by user from their local PC.
 */
export const ImageField = (props: ImageFieldProps) => {
  // eslint-disable-next-line solid/reactivity
  const name = props.name;

  const { data } = useFelteContext();
  const [value, setValue] = createSignal("");

  const outerDataValue = createMemo(() => data(name) as string);
  const isDataUri = createMemo(() => {
    const value = outerDataValue();
    return typeof value === "string" && value.startsWith("data:");
  });

  createFieldBindings<string>(name, value, (v) => {
    if (!v.startsWith("data:")) {
      setValue(v);
    }
  });

  const handleUrlInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    event,
  ) => {
    const next = event.currentTarget.value;
    setValue(next);
  };

  const handleFileChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (
    e,
  ) => {
    const fileInputEl = e.currentTarget;
    const file = fileInputEl.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setValue(result);
      fileInputEl.value = "";
    };
    reader.readAsDataURL(file);
  };

  const clearField = () => {
    setValue("");
  };

  return (
    <div class="flex flex-row items-center gap-2">
      <div class="w-16 h-20 flex items-center justify-center overflow-clip">
        <Show when={outerDataValue()}>{(url) => <img src={url()} />}</Show>
      </div>
      <div class="flex flex-row items-center gap-2">
        <Show
          when={isDataUri()}
          fallback={
            <input
              class="input"
              value={value()}
              onInput={handleUrlInput}
              placeholder="URL"
            />
          }
        >
          <button type="button" class="btn btn-outline" onClick={clearField}>
            清除上传
          </button>
        </Show>
        或
        <label class="btn btn-outline">
          <span>上传图片</span>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};
