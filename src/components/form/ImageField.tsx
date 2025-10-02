import { createField } from "@felte/solid";
import {
  createEffect,
  createMemo,
  createSignal,
  Show,
  untrack,
  type JSX,
} from "solid-js";
import { useFormContext } from "./Forms";

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

  const { field, onInput, onBlur } = createField(name);
  void field;

  const { formData } = useFormContext();
  const [value, setValue] = createSignal("");

  const outerFormDataValue = createMemo(() => formData(name));
  const isDataUri = createMemo(() => {
    const value = outerFormDataValue();
    return typeof value === "string" && value.startsWith("data:");
  });

  createEffect(() => {
    const next = outerFormDataValue();
    if (typeof next !== "string") return;
    if (next !== untrack(value)) {
      if (!next.startsWith("data:")) {
        setValue(next);
      }
    }
  });

  const handleUrlInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    event,
  ) => {
    const next = event.currentTarget.value;
    setValue(next);
    onInput(next);
  };

  const handleUrlBlur = () => {
    onBlur();
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
      onInput(result);
      onBlur();
      fileInputEl.value = "";
    };
    reader.readAsDataURL(file);
  };

  const clearField = () => {
    setValue("");
    onInput("");
    onBlur();
  };

  return (
    <div use:field class="flex flex-row items-center gap-2">
      <div class="w-16 h-20 flex items-center justify-center overflow-clip">
        <Show when={formData(name)}>
          <img src={formData(name) as string} />
        </Show>
      </div>
      <div class="flex flex-row items-center gap-2">
        <Show
          when={isDataUri()}
          fallback={
            <input
              class="input"
              value={value()}
              onInput={handleUrlInput}
              onBlur={handleUrlBlur}
              placeholder="URL"
            />
          }
        >
          <button
            type="button"
            class="btn btn-outline"
            onClick={clearField}
          >
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
            onBlur={onBlur}
          />
        </label>
      </div>
    </div>
  );
};
