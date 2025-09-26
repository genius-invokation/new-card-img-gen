import { createForm } from "@felte/solid";
import type { AppConfig } from "../../types";

export interface FormsProps {
  config: AppConfig;
  onSubmit: (data: AppConfig) => void;
}

export const Forms = (props: FormsProps) => {
  const { form } = createForm({
    onSubmit: (data) => {
      console.log(data);
      const newConfig = { ...props.config, ...data };
      props.onSubmit(newConfig);
    },
  });
  void form;
  return (
    <div>
      <form use:form>
        <input name="solo" placeholder="Solo ID" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
