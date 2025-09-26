import { createSignal, createResource, Show } from "solid-js";
import type { AppConfig, AllRawData } from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms } from "./components/form/Forms";
import { toBlob } from "html-to-image";
import { createEffect } from "solid-js";

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
  authorImageUrl: "/vite.svg",
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
    const renderingArea = document.querySelector<HTMLElement>(".layout");
    if (!renderingArea) {
      alert(`未找到渲染区域`);
      return;
    }
    const originalParent = renderingArea.parentElement;
    let objectUrl: string | null = null;
    try {
      captureContainer.innerHTML = "";
      captureContainer.append(renderingArea);
      // make them reflow (?)
      await new Promise((r) => setTimeout(r, 100));
      const { width, height } = getComputedStyle(renderingArea);
      const blob = await toBlob(captureContainer, {
        type: "image/png",
        width: parseFloat(width),
        height: parseFloat(height),
      });
      if (!blob) {
        alert("导出失败");
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `card-${Date.now()}.png`;
      link.href = objectUrl;
      link.click();
      link.remove();
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      originalParent?.append(renderingArea);
    }
  };

  let captureContainer!: HTMLDivElement;

  return (
    <GlobalSettings.Provider
      value={{
        language: () => config().language || "zh",
        cardbackImage: () => config().cardbackImage,
        displayStory: () => !!config().displayStory,
        displayId: () => !!config().displayId,
      }}
    >
      <div class="app" bool:data-dev={import.meta.env.DEV}>
        <div class="sidebar">
          <header class="header">
            <h1>卡图生成</h1>
            <button onClick={exportImage}>导出图片</button>
          </header>
          <Forms config={config()} onSubmit={setConfig} />
        </div>
        <div class="renderer-container">
          
          <Show
            when={npmData.state === "ready"}
            fallback={<div>Loading data...</div>}
          >
            <Renderer {...config()} />
          </Show>
        </div>
        <div class="capture-container" ref={captureContainer} />
        <div class="capturing-hint">生成图片中</div>
      </div>
    </GlobalSettings.Provider>
  );
};
