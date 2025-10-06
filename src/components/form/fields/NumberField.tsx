import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface NumberFieldProps extends ComponentProps<"input"> {}

export default function NumberField(props: NumberFieldProps) {
  const [local, rest] = splitProps(props, ["class"]);
  const field = useFieldContext<number>();
  return (
    <input
      type="number"
      class={`input ${local.class ?? ""}`}
      onInput={(e) => field().handleChange(e.currentTarget.valueAsNumber)}
      onBlur={() => field().handleBlur()}
      value={field().state.value}
      {...rest}
    />
  );
}
