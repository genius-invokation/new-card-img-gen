import { createSignal, createMemo } from "solid-js";
import { type AppProps } from "./types";
import { GlobalSettings } from "./context";
import * as MOCK_DATA from "@gi-tcg/static-data";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import { Forms } from "./components/form/Forms";

// NOTE: 绝大多数逻辑直接从 ref/client.tsx 迁移，保证渲染/解析逻辑不被删改，仅适配 Solid API。

const APP_CONFIG: AppProps = {
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
  const [config] = createSignal<AppProps>({ ...APP_CONFIG });
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
          <div>
            <h1>卡图制作</h1>
          </div>
          <Forms />
        </div>
        <div class="renderer-container">
          <Renderer {...config()} />
        </div>
      </div>
    </GlobalSettings.Provider>
  );
};
