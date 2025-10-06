import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface TextFieldProps extends ComponentProps<"input"> {}

export default function TextField(props: TextFieldProps) {
  const [local, rest] = splitProps(props, ["class"]);
  const field = useFieldContext<string>();
  return (
    <input
      type="text"
      class={`input ${local.class ?? ""}`}
      onInput={(e) => field().handleChange(e.currentTarget.value)}
      onBlur={() => field().handleBlur()}
      value={field().state.value}
      {...rest}
    />
  );
}
