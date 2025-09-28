import { createSignal, createResource, Show, onMount } from "solid-js";
import type { AppConfig, AllRawData } from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms } from "./components/form/Forms";
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

const APP_CONFIG: AppConfig = {
  solo: "A1503",
  data: EMPTY_DATA,
  language: "zh",
  authorName: "Author",
  authorImageUrl: `${import.meta.env.BASE_URL}vite.svg`,
  cardbackImage: "UI_Gcg_CardBack_Fonta_03",
  displayId: true,
  displayStory: true,
  mirroredLayout: false,
};

export const App = () => {
  const [npmData] = createResource(async () => {
    const data = await import(
      // @ts-expect-error Remote module no typings
      /* @vite-ignore */ "https://esm.sh/@gi-tcg/static-data"
    );
    return data;
  });
  createEffect(() => {
    if (npmData.state === "ready") {
      console.log("Loaded data from npm:", npmData());
      setConfig((c) => ({ ...c, data: npmData() }));
    }
  });

  const [config, setConfig] = createSignal<AppConfig>(APP_CONFIG);

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

  onMount(() => {
    setRenderMount(previewContainer);
  });

  return (
    <GlobalSettings.Provider
      value={{
        language: () => config().language || "zh",
        cardbackImage: () => config().cardbackImage,
        displayStory: () => !!config().displayStory,
        displayId: () => !!config().displayId,
      }}
    >
      <div
        class="relative h-[100vh] w-[100vw] flex flex-col min-h-0 md:min-w-0 md:flex-row content-center items-center md:overflow-hidden"
        bool:data-dev={import.meta.env.DEV}
      >
        <div class="md:h-full md:w-[50%] flex flex-col">
          <header class="flex flex-row prose items-center m-4 gap-4">
            <h1 class="mb-0">卡图生成</h1>
          </header>
          <Forms config={config()} onSubmit={setConfig} />
        </div>
        <div class="preview-container" ref={previewContainer}>
          <button class="absolute right-6 top-2 z-1 btn btn-soft btn-secondary" onClick={exportImage}>
            导出图片
          </button>
        </div>
        <div class="capture-container" ref={captureContainer} />
        <div class="capturing-hint">生成图片中</div>
      </div>
      <Portal mount={renderMount()}>
        <Show
          when={npmData.state === "ready"}
          fallback={
            <div class="layout empty" classList={{ loading: npmData.loading }}>
              Loading data...
            </div>
          }
        >
          <Renderer {...config()} />
        </Show>
      </Portal>
    </GlobalSettings.Provider>
  );
};
