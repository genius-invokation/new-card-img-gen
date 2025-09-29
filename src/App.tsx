import { createSignal, createResource, Show, onMount } from "solid-js";
import type { AppConfig, AllRawData, Language } from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms, type FormValue } from "./components/form/Forms";
import { createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { domToBlob } from "modern-screenshot";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。

const EMPTY_DATA: AllRawData = {
  keywords: [],
  characters: [],
  actionCards: [],
  entities: [],
};

const DATA_SOURCE =
  import.meta.env.DATA_SOURCE ||
  "return fetch(`https://raw.githubusercontent.com/genius-invokation/genius-invokation/refs/heads/main/packages/static-data/src/data/${name}.json`).then((r) => r.json())";

const INITIAL_FORM_VALUE: FormValue = {
  dataSource: DATA_SOURCE,
  general: {
    mode: "character",
    solo: "A1503",
    language: "zh",
    authorName: "Author",
    authorImageUrl: `${import.meta.env.BASE_URL}vite.svg`,
    cardbackImage: "UI_Gcg_CardBack_Championship_11",
    displayId: true,
    displayStory: true,
    mirroredLayout: false,
  },
};

const AsyncFunction = (async () => {}).constructor as FunctionConstructor;
const getData = async (name: string) => {
  const factory = new AsyncFunction("name", DATA_SOURCE);
  return factory(name);
};

export const App = () => {
  const [data] = createResource(async () => {
    const [characters, actionCards, entities, keywords] = await Promise.all([
      getData("characters"),
      getData("action_cards"),
      getData("entities"),
      getData("keywords"),
    ]);
    return { characters, actionCards, entities, keywords } as AllRawData;
  });

  const [config, setConfig] = createSignal<AppConfig>();
  const [formValue, setFormValue] = createSignal<FormValue>(INITIAL_FORM_VALUE);

  const onSubmitForm = (value: FormValue) => {
    setFormValue(value);
    setMobilePreviewing(true);
  };

  createEffect(() => {
    if (data.state === "ready") {
      setConfig({
        data: data(),
        ...formValue().general,
      });
    }
  });

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
      link.download = `card-${Date.now()}.png`;
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
        language: () => config()?.language || "zh",
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
            <div class="layout empty" classList={{ loading: data.loading }}>
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
