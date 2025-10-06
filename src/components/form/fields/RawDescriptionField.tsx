import { splitProps, type ComponentProps } from "solid-js";
import { useFieldContext } from "../shared";

export interface RawDescriptionFieldProps extends ComponentProps<"textarea"> {
  id?: string;
}

export default function RawDescriptionFieldProps(
  props: RawDescriptionFieldProps,
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
