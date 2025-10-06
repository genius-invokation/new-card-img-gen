import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface ToggleFieldProps extends ComponentProps<"input"> {}

export default function ToggleField(props: ToggleFieldProps) {
  const [local, rest] = splitProps(props, ["class"]);
  const field = useFieldContext<boolean>();
  return (
    <input
      type="checkbox"
      class={`toggle toggle-secondary ${local.class ?? ""}`}
      onChange={(e) => field().handleChange(e.currentTarget.checked)}
      onBlur={() => field().handleBlur()}
      checked={field().state.value}
      {...rest}
    />
  );
}
