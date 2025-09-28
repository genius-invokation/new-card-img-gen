import { createForm } from "@felte/solid";
import type { AppConfig } from "../../types";
import { createEffect, createSignal, For, on, onMount } from "solid-js";
import { GeneralConfigTab } from "./GenerialConfigTab";
import { DataSourceTab } from "./DataSourceTab";

export interface FormsProps {
  config: AppConfig;
  onSubmit: (data: AppConfig) => void;
}

const TAB_LISTS = [
  {
    title: "通用",
    key: "general",
    component: GeneralConfigTab,
  },
  {
    title: "数据源",
    key: "dataSource",
    component: DataSourceTab,
  },
] as const;

type TabKey = (typeof TAB_LISTS)[number]["key"];

export const Forms = (props: FormsProps) => {
  const {
    form,
    setData,
    setFields,
    isDirty,
    setIsDirty,
    isValid,
    isSubmitting,
    isValidating,
  } = createForm<AppConfig>({
    onSubmit: (data) => {
      setIsDirty(false);
      console.log(data);
      props.onSubmit({ ...props.config, ...data });
    },
    debounced: {
      timeout: 300,
      validate: async () => {
        return void 0;
      },
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

  onMount(() => {
    setInterval(() => {
      if (isValid() && isDirty()) {
        submitBtn.click();
      }
    }, 1000);
  });

  let submitBtn!: HTMLButtonElement;

  const [currentTab, setCurrentTab] = createSignal<TabKey>("general");

  return (
    <form use:form class="flex-grow p-4 flex flex-col gap-4">
      <div role="tablist" class="tabs tabs-border">
        <For each={TAB_LISTS}>
          {(tab) => (
            <button
              role="tab"
              class="tab"
              classList={{
                "tab-active": currentTab() === tab.key,
              }}
              onClick={() => setCurrentTab(tab.key)}
            >
              {tab.title}
            </button>
          )}
        </For>
      </div>
      <For each={TAB_LISTS}>
        {(tab) => (
          <div
            role="tabpanel"
            class="pt-4 flex-grow hidden data-[shown]:block"
            bool:data-shown={currentTab() === tab.key}
          >
            <tab.component />
          </div>
        )}
      </For>
      <button
        type="submit"
        class="btn btn-primary"
        ref={submitBtn}
        disabled={!isValid()}
      >
        Submit
      </button>
    </form>
  );
};
