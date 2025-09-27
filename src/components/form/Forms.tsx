import { createForm } from "@felte/solid";
import type { AppConfig } from "../../types";
import { createEffect, on } from "solid-js";

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
    debounced: {
      timeout: 300,
      validate: async () => {
        return void 0;
      }
    }
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
      <form use:form class="p-4 flex flex-col gap-4">
        <div class="grid grid-cols-[max-content_1fr] gap-2">
          <label class="fieldset-legend" for="solo">
            Solo ID
          </label>
          <input class="input" name="solo" placeholder="Solo ID" />

          <label class="fieldset-legend" for="version">
            Version
          </label>
          <input class="input" name="version" placeholder="Version" />

          <label class="fieldset-legend" for="cardbackImage">
            Cardback Image
          </label>
          <input class="input" name="cardbackImage" />

          <label class="fieldset-legend" for="language">
            Language
          </label>
          <input class="input" name="language" />

          <label class="fieldset-legend" for="authorName">
            Author Name
          </label>
          <input class="input" name="authorName" />

          <label class="fieldset-legend" for="authorImageUrl">
            Author Image URL
          </label>
          <input class="input" name="authorImageUrl" />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
