import { createForm } from "@felte/solid";
import type { AppConfig } from "../../types";
import { createEffect, on } from "solid-js";
import "./Forms.css";

export interface FormsProps {
  config: AppConfig;
  onSubmit: (data: AppConfig) => void;
}

export const Forms = (props: FormsProps) => {
  const { form, setData, setFields } = createForm<AppConfig>({
    onSubmit: (data) => {
      console.log(data);
      props.onSubmit({ ...props.config, ...data });
    },
  });
  createEffect(
    on(
      () => props.config,
      (config) => {
        setData(config);
        setFields("solo", config.solo);
      },
    ),
  );
  void form;
  return (
    <div>
      <form use:form class="temp-form">
        <input name="solo" placeholder="Solo ID" />
        <input name="cardbackImage" />
        <input name="language" />
        <input name="authorName" />
        <input name="authorImageUrl" />
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
