import { createSignal } from "solid-js";
import { type AppConfig } from "./types";
import { GlobalSettings } from "./context";
import * as MOCK_DATA from "@gi-tcg/static-data";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms } from "./components/form/Forms";
import { toBlob } from "html-to-image";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。

const APP_CONFIG: AppConfig = {
  solo: "A1315",
  data: MOCK_DATA,
  language: "zh",
  authorName: "Author",
  authorImageUrl: "/vite.svg",
  cardbackImage: "UI_Gcg_CardBack_Fonta_03",
  displayId: true,
  displayStory: true,
  mirroredLayout: false,
};

export const App = () => {
  const [config, setConfig] = createSignal<AppConfig>(APP_CONFIG);

  const exportImage = async () => {
    const renderingArea = document.querySelector<HTMLElement>(".layout");
    if (!renderingArea) {
      alert(`未找到渲染区域`);
      return;
    }
    let objectUrl: string | null = null;
    const { width, height } = getComputedStyle(renderingArea);
    try {
      captureContainer.innerHTML = "";
      captureContainer.append(renderingArea.cloneNode(true));
      const blob = await toBlob(captureContainer, {
        type: "image/png",
        width: parseInt(width),
        height: parseInt(height),
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
      captureContainer.innerHTML = "";
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
      <div class="app">
        <div class="sidebar">
          <header class="header">
            <h1>卡图生成</h1>
            <button onClick={exportImage}>导出图片</button>
          </header>
          <Forms config={config()} onSubmit={setConfig} />
        </div>
        <div class="renderer-container">
          <Renderer {...config()} />
        </div>
        <div class="capture-container" ref={captureContainer} />
        <div class="capturing-hint">生成图片中</div>
      </div>
    </GlobalSettings.Provider>
  );
};
