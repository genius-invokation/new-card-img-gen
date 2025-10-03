import { createForm } from "@felte/solid";
import type { Paths, Traverse } from "@felte/core";
import {
  VERSION_REGEX,
  type Language,
  type PlayCost,
  type Version,
} from "../../types";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { GeneralConfigTab } from "./GenerialConfigTab";
import { NewItemsTab } from "./NewItemTab";
import { OverrideTab } from "./OverrideTab";
import importSvg from "./import.svg";
import exportSvg from "./export.svg";

export interface FormsProps {
  initialValue: FormValue;
  versionList: string[];
  loading?: boolean;
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
] as const;

export interface NewCharacterData {
  id: number;
  name: string;
  hp: number;
  maxEnergy: number;
  tags: string[]; // TODO: better typing
  storyText?: string;
  skills: NewSkillData[];
  cardFaceUrl: string;
}

export interface NewSkillData {
  id: number;
  type: string; // TODO: better typing
  name: string;
  rawDescription: string;
  playCost: PlayCost[];
  icon?: string;
  iconUrl?: string;
}

export interface NewActionCardData {
  type: string; // TODO: better typing
  id: number;
  name: string;
  tags: string[]; // TODO: better typing
  relatedCharacterId: number | null;
  rawDescription: string;
  playCost: PlayCost[];
  cardFaceUrl: string;
}

export interface NewEntityData {
  id: number;
  type: string; // TODO: better typing
  name: string;
  tags: string[]; // TODO: better typing
  skills: []; // TODO: how to handle techniques?
  rawDescription: string;
  buffIcon?: string;
  buffIconUrl?: string;
  cardFaceUrl?: string;
}

export interface NewKeywordData {
  id: number;
  name: string;
  rawDescription: string;
}

export interface FormValue {
  general: {
    mode: "character" | "singleActionCard" | "versionedActionCards";
    characterId?: number;
    actionCardId?: number;
    version: Version;
    language: Language;
    authorName?: string;
    authorImageUrl?: string;
    mirroredLayout?: boolean;
    cardbackImage: string;
    displayId: boolean;
    displayStory: boolean;
  };
  newItems: {
    characters: NewCharacterData[];
    actionCards: NewActionCardData[];
    entities: NewEntityData[];
    keywords: NewKeywordData[];
  };
}

type TabKey = (typeof TAB_LISTS)[number]["key"];

type FelteAccessor<T extends object> = (<R>(
  selector: (storeValue: T) => R,
) => R) &
  (<P extends Paths<T> = Paths<T>, V extends Traverse<T, P> = Traverse<T, P>>(
    path: P,
  ) => V) &
  ((path: string) => any) &
  (() => T);

export interface FormContextValue {
  formData: FelteAccessor<FormValue>;
  versionList: Accessor<string[]>;
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
      // validate: (data) => {
      //   if (
      //     data.general.version &&
      //     !VERSION_REGEX.test(data.general.version)
      //   ) {
      //     return { general: { version: "版本格式错误" } };
      //   }
      // },
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

  const previewVisible = () =>
    !!document.querySelector(".preview-container")?.scrollHeight;

  let submitInterval: number;
  onMount(() => {
    submitInterval = setInterval(() => {
      if (previewVisible() && isValid() && isDirty()) {
        formEl.requestSubmit();
      }
    }, 1000);
    setIsDirty(true);
  });
  onCleanup(() => {
    if (submitInterval) {
      clearInterval(submitInterval);
    }
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

  createEffect(() => {
    if (import.meta.env.DEV) {
      console.log(data());
    }
  });

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
      setFields("general.version", json.general.version);
      if (previewVisible() && isValid()) {
        formEl.requestSubmit();
      }
    } catch {
      alert("导入失败：无法解析 JSON");
    } finally {
      currentTarget.value = "";
    }
  };

  return (
    <FormContext.Provider
      value={{
        versionList: () => props.versionList,
        formData: data as unknown as FelteAccessor<FormValue>,
      }}
    >
      <form use:form class="w-full flex-grow min-h-0 p-4 flex flex-col" ref={formEl}>
        <div class="overflow-x-auto max-w-full flex-shrink-0">
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
              class="pt-4 pb-2 flex-grow min-h-0 overflow-auto hidden data-[shown]:block"
              bool:data-shown={currentTab() === tab.key}
            >
              <tab.component />
            </div>
          )}
        </For>
        <button
          type="submit"
          class="flex-shrink-0 btn btn-primary"
          disabled={!isValid() || props.loading}
        >
          {props.loading ? "生成中" : "生成"}
        </button>
      </form>
    </FormContext.Provider>
  );
};
