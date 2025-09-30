import { createSignal, createResource, Show, onMount } from "solid-js";
import type { AppConfig, AllRawData, Language } from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms, type FormValue } from "./components/form/Forms";
import { createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { domToBlob } from "modern-screenshot";
import { ASSETS_API_ENDPOINT } from "./constants";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。

const EMPTY_DATA: AllRawData = {
  keywords: [],
  characters: [],
  actionCards: [],
  entities: [],
};

const INITIAL_FORM_VALUE: FormValue = {
  general: {
    mode: "character",
    characterId: 1503,
    actionCardId: 332005,
    version: "v6.0.0",
    language: "CHS",
    authorName: "Author",
    authorImageUrl: `${import.meta.env.BASE_URL}vite.svg`,
    cardbackImage: "UI_Gcg_CardBack_Championship_11",
    displayId: true,
    displayStory: true,
    mirroredLayout: false,
  },
};

const getData = async (version: string, language: Language) => {
  const data: Partial<AllRawData> = {};
  await Promise.all(
    (["characters", "action_cards", "entities", "keywords"] as const).map(
      async (category) => {
        const key = category === "action_cards" ? "actionCards" : category;
        data[key] = await fetch(
          `${ASSETS_API_ENDPOINT}/data/${version}/${language}/${category}`,
        ).then(async (r) =>
          r.ok
            ? (
                await r.json()
              ).data
            : Promise.reject(new Error(await r.text())),
        );
      },
    ),
  );
  return data as AllRawData;
};

export const App = () => {
  const [config, setConfig] = createSignal<AppConfig>();
  const [loading, setLoading] = createSignal(true);
  let prevFormValue: FormValue = INITIAL_FORM_VALUE;

  const onSubmitForm = async (newFormValue: FormValue) => {
    const oldConfig = config();
    const prevVersion = prevFormValue.general.version;
    const newVersion = newFormValue.general.version;
    const prevLanguage = prevFormValue.general.language;
    const newLanguage = newFormValue.general.language;
    const shouldUpdateData = !(
      prevVersion === newVersion && prevLanguage === newLanguage
    );
    try {
      let data = oldConfig?.data;
      if (shouldUpdateData || !data) {
        data = await getData(newVersion, newLanguage);
      }
      setConfig({
        data,
        ...newFormValue.general,
      });
      prevFormValue = newFormValue;
      setMobilePreviewing(true);
    } catch (e) {
      alert((e as Error).message || "加载数据失败");
    }
  };

  const filename = () => {
    const c = config();
    if (c?.mode === "character") {
      return `A${c.characterId}`;
    }
    if (c?.mode === "singleActionCard") {
      return `C${c.actionCardId}`;
    }
    if (c?.mode === "versionedActionCards") {
      return c.version || "vX.Y.Z";
    }
    return "card";
  };

  const exportImage = async () => {
    let objectUrl: string | null = null;
    try {
      setRenderMount(captureContainer);
      // make them reflow (?)
      await new Promise((r) => setTimeout(r, 100));
      const blob = await domToBlob(captureContainer, {
        type: "image/png",
        width: captureContainer.scrollWidth,
        height: captureContainer.scrollHeight,
      });
      if (!blob.size) {
        alert("导出失败");
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${filename()}.png`;
      link.href = objectUrl;
      link.click();
      link.remove();
    } catch (e) {
      if (e instanceof Error) {
        alert(`导出失败: ${e}`);
      }
      console.error(e);
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setRenderMount(previewContainer);
    }
  };

  let captureContainer!: HTMLDivElement;
  let previewContainer!: HTMLDivElement;
  const [renderMount, setRenderMount] = createSignal<HTMLElement>();
  const [mobilePreviewing, setMobilePreviewing] = createSignal(false);

  onMount(() => {
    setRenderMount(previewContainer);
  });

  return (
    <GlobalSettings.Provider
      value={{
        allData: () => config()?.data || EMPTY_DATA,
        language: () => config()?.language || "CHS",
        cardbackImage: () =>
          config()?.cardbackImage || INITIAL_FORM_VALUE.general.cardbackImage,
        displayStory: () => !!config()?.displayStory,
        displayId: () => !!config()?.displayId,
      }}
    >
      <div
        class="relative h-[100vh] w-[100vw] flex flex-col min-h-0 md:min-w-0 md:flex-row content-center items-center md:overflow-hidden"
        bool:data-dev={import.meta.env.DEV}
      >
        <div class="h-full w-full md:w-[50%] flex flex-col items-start">
          <header class="flex flex-row prose items-center m-4 gap-4">
            <h1 class="mb-0">卡图生成</h1>
          </header>
          <Forms initialValue={INITIAL_FORM_VALUE} onSubmit={onSubmitForm} />
        </div>
        <input type="checkbox" checked={mobilePreviewing()} hidden />
        <div class="preview-container" ref={previewContainer}>
          <div class="fixed right-6 top-2 z-1 flex flex-row gap-2">
            <button
              class="btn btn-soft btn-accent md:hidden"
              onClick={() => setMobilePreviewing(false)}
            >
              &cross;
            </button>
            <button class="btn btn-soft btn-secondary" onClick={exportImage}>
              导出图片
            </button>
          </div>
        </div>
        <div class="capture-container" ref={captureContainer} />
        <div class="capturing-hint">渲染图片中</div>
      </div>
      <Portal mount={renderMount()}>
        <Show
          when={config()}
          fallback={
            <div class="layout empty" classList={{ loading: loading() }}>
              Loading data...
            </div>
          }
        >
          {(config) => <Renderer {...config()} />}
        </Show>
      </Portal>
    </GlobalSettings.Provider>
  );
};
