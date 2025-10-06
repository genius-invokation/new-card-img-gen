import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface TextAreaFieldProps extends ComponentProps<"textarea"> {
}

export default function TextAreaFieldProps(
  props: TextAreaFieldProps,
) {
  const [local, rest] = splitProps(props, ["class"]);
  const field = useFieldContext<string>();
  return (
    <>
      <textarea
        class={`textarea ${local.class}`}
        {...rest}
        onInput={(e) => field().handleChange(e.currentTarget.value)}
        value={field().state.value}
        onBlur={() => field().handleBlur()}
      />
    </>
  );
}
