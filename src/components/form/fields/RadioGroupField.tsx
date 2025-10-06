import { createUniqueId, For, splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";
import type { SelectOption } from "./SelectField";

export interface RadioGroupFieldProps<T extends string> {
  class?: string;
  options: SelectOption<T>[];
}

export default function RadioGroupField<T extends string = string>(
  props: RadioGroupFieldProps<T>,
) {
  const [local, rest] = splitProps(props, ["class"]);
  const field = useFieldContext<string>();
  const idPrefix = createUniqueId();
  return (
    <div
      class={`flex flex-row gap-8 items-center ${local.class ?? ""}`}
      {...rest}
    >
      <For each={props.options}>
        {(option) => (
          <div class="flex flex-row items-center gap-2">
            <input
              type="radio"
              class="radio"
              id={idPrefix + option.value}
              value={option.value}
              checked={field().state.value === option.value}
              onInput={(e) => {
                if (e.currentTarget.checked) {
                  field().handleChange(option.value);
                }
              }}
              onBlur={() => field().handleBlur()}
            />
            <label for={idPrefix + option.value}>{option.label}</label>
          </div>
        )}
      </For>
    </div>
  );
}
