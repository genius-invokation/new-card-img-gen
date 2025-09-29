import { createForm } from "@felte/solid";
import type { AppConfig, Language } from "../../types";
import {
  createContext,
  createEffect,
  createSignal,
  For,
  on,
  onMount,
  useContext,
  type Accessor,
} from "solid-js";
import { GeneralConfigTab } from "./GenerialConfigTab";
import { DataSourceTab } from "./DataSourceTab";

export interface FormsProps {
  initialValue: FormValue;
  onSubmit: (data: FormValue) => void;
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

export interface FormValue {
  dataSource: string;
  general: {
    mode: "character" | "singleActionCard" | "versionedActionCards";
    characterId?: number;
    actionCardId?: number;
    version?: `v${number}.${number}.${number}${"" | `-beta`}`;
    language: Language;
    authorName?: string;
    authorImageUrl?: string;
    mirroredLayout?: boolean;
    cardbackImage: string;
    displayId: boolean;
    displayStory: boolean;
  };
}

type TabKey = (typeof TAB_LISTS)[number]["key"];

export interface FormContextValue {
  formData: Accessor<FormValue>;
}

const FormContext = createContext<FormContextValue>();
export const useFormContext = () => {
  return useContext(FormContext)!;
};

export const Forms = (props: FormsProps) => {
  const { form, data, isDirty, setIsDirty, isValid } = createForm<FormValue>({
    initialValues: props.initialValue,
    onSubmit: (data) => {
      setIsDirty(false);
      props.onSubmit(data);
    },
    // debounced: {
    //   timeout: 300,
    //   validate: async () => {
    //     if (!formEl.checkValidity()) {
    //       return {}
    //     }
    //   },
    // },
  });
  void form;

  const notMobile = () => window.matchMedia("(width >= 48rem)").matches;

  onMount(() => {
    setInterval(() => {
      if (notMobile() && isValid() && isDirty()) {
        formEl.requestSubmit();
      }
    }, 1000);
  });

  let formEl!: HTMLFormElement;

  const [currentTab, setCurrentTab] = createSignal<TabKey>("general");

  return (
    <FormContext.Provider value={{ formData: data }}>
      <form use:form class="w-full flex-grow p-4 flex flex-col" ref={formEl}>
        <div role="tablist" class="tabs tabs-border">
          <For each={TAB_LISTS}>
            {(tab) => (
              <button
                type="button"
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
          disabled={!isValid()}
        >
          生成
        </button>
      </form>
    </FormContext.Provider>
  );
};
