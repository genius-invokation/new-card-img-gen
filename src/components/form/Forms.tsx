import { createForm } from "@felte/solid";
import type { Language } from "../../types";
import {
  createContext,
  createSignal,
  For,
  type JSX,
  onMount,
  useContext,
  type Accessor,
} from "solid-js";
import { GeneralConfigTab } from "./GenerialConfigTab";
import { DataSourceTab } from "./DataSourceTab";
import { NewItemsTab } from "./NewItemTab";
import { OverrideTab } from "./OverrideTab";
import importSvg from "./import.svg";
import exportSvg from "./export.svg";

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
    title: "新卡编辑",
    key: "newItems",
    component: NewItemsTab,
  },
  {
    title: "微调",
    key: "override",
    component: OverrideTab,
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
  const { form, data, isDirty, setIsDirty, isValid, setData, setFields } =
    createForm<FormValue>({
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
  let importInputEl!: HTMLInputElement;

  const [currentTab, setCurrentTab] = createSignal<TabKey>("general");
  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(data(), null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `config-${Date.now()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
    } catch {
      alert("导出失败");
    }
  };

  const handleImportClick = () => {
    importInputEl.click();
  };
  const handleImportFileChange: JSX.ChangeEventHandler<
    HTMLInputElement,
    Event
  > = async (e) => {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const file = currentTarget.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setData(json);
      // seems bug?
      setFields("dataSource", json.dataSource);
      if (notMobile() && isValid()) {
        formEl.requestSubmit();
      }
    } catch {
      alert("导入失败：无法解析 JSON");
    } finally {
      currentTarget.value = "";
    }
  };

  return (
    <FormContext.Provider value={{ formData: data }}>
      <form use:form class="w-full flex-grow p-4 flex flex-col" ref={formEl}>
        <div class="overflow-x-auto max-w-full">
          <div role="tablist" class="tabs tabs-border  min-w-max">
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
            <div class="grow" />
            <div class="flex flex-row items-center">
              <button
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
                onClick={handleImportClick}
              >
                <img src={importSvg} />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
                onClick={handleExport}
              >
                <img src={exportSvg} />
              </button>
              <input
                ref={importInputEl}
                type="file"
                accept="application/json"
                class="hidden"
                onChange={handleImportFileChange}
              />
            </div>
          </div>
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
        <button type="submit" class="btn btn-primary" disabled={!isValid()}>
          生成
        </button>
      </form>
    </FormContext.Provider>
  );
};
