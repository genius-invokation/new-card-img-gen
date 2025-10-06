import { For, splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string>
  extends ComponentProps<"select"> {
  options: SelectOption<T>[];
}

export default function SelectField<T extends string = string>(
  props: SelectFieldProps<T>,
) {
  const [local, rest] = splitProps(props, ["options"]);
  const field = useFieldContext<T>();
  return (
    <select
      {...rest}
      class="select"
      onInput={(e) => field().handleChange(e.currentTarget.value as T)}
      onBlur={() => field().handleBlur()}
      value={field().state.value}
    >
      <For each={local.options}>
        {(option) => (
          <option
            value={option.value}
            selected={field().state.value === option.value}
          >
            {option.label}
          </option>
        )}
      </For>
    </select>
  );
}
