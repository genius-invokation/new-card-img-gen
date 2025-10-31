import { createSignal, createResource, Show, onMount } from "solid-js";
import {
  type AppConfig,
  type AllRawData,
  type Language,
  type Version,
  VERSION_REGEX,
  type SkillRawData,
} from "./types";
import { GlobalSettings } from "./context";
import "./App.css";
import { Renderer } from "./components/renderer/Renderer";
import {
  Forms,
  type FormValue,
  type NewSkillData,
} from "./components/form/Forms";
import { Portal } from "solid-js/web";
import { domToBlob } from "modern-screenshot";
import {
  MOCK_NEW_ACTION_CARDS,
  MOCK_NEW_CHARACTERS,
  MOCK_NEW_ENTITIES,
} from "./mock_data";
import { ASSETS_API_ENDPOINT, getData } from "./shared";
import {
  applyCharacterOverrides,
  applyEntityOverrides,
  applyActionCardOverrides,
} from "./override";

export interface RenderConfig {
  format?: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface RenderAppOption extends AppConfig {
  render?: RenderConfig;
}

const EMPTY_DATA: AllRawData = {
  keywords: [],
  characters: [],
  actionCards: [],
  entities: [],
};

const search = new URLSearchParams(window.location.search);

let versionFromUrl = search.get("version") || "latest";
if (versionFromUrl && !VERSION_REGEX.test(versionFromUrl)) {
  alert("URL 中的 version 参数格式错误，应为 vX.Y.Z 或 latest");
  versionFromUrl = "latest";
}

const INITIAL_FORM_VALUE: FormValue = {
  general: {
    mode: "balanceAdjustment", // test: "character"
    characterId: Number(search.get("character_id") || Number.NaN) || 1503,
    actionCardId: Number(search.get("action_card_id") || Number.NaN) || 332005,
    language: "CHS",
    version: versionFromUrl as Version,
    authorName: search.get("author_name") || "❤︎ From「雨酱牌」",
    authorImageUrl: `${import.meta.env.BASE_URL}vite.svg`,
    cardbackImage: "UI_Gcg_CardBack_Championship_11",
    displayId: true,
    displayStory: true,
    mirroredLayout: false,
  },
  newItems: {
    characters: MOCK_NEW_CHARACTERS,
    actionCards: MOCK_NEW_ACTION_CARDS,
    entities: MOCK_NEW_ENTITIES,
    keywords: [],
  },
  adjustments: [],
};

export const App = () => {
  const [config, setConfig] = createSignal<AppConfig>();
  const [versionList] = createResource<Version[]>(
    () => {
      return fetch(`${ASSETS_API_ENDPOINT}/metadata`).then(async (r) =>
        r.ok
          ? (await r.json()).availableVersions
          : Promise.reject(new Error(await r.text())),
      );
    },
    {
      initialValue: [],
    },
  );
  const [loading, setLoading] = createSignal(false);
  const remoteFetched = {
    version: INITIAL_FORM_VALUE.general.version,
    language: INITIAL_FORM_VALUE.general.language,
    data: null as AllRawData | null,
  };
  const onSubmitForm = async (newFormValue: FormValue) => {
    if (import.meta.env.DEV) {
      console.log(newFormValue);
    }
    const prevVersion = remoteFetched.version;
    const newVersion = newFormValue.general.version;
    const prevLanguage = remoteFetched.language;
    const newLanguage = newFormValue.general.language;
    const shouldUpdateData = !(
      prevVersion === newVersion && prevLanguage === newLanguage
    );
    try {
      if (shouldUpdateData || !remoteFetched.data) {
        setLoading(true);
        remoteFetched.version = newVersion;
        remoteFetched.language = newLanguage;
        // fetch new data
        remoteFetched.data = await getData(newVersion, newLanguage);
      }
      const data = structuredClone(remoteFetched.data);
      
      // override data
      data.characters = applyCharacterOverrides(data.characters);
      data.entities = applyEntityOverrides(data.entities);
      data.actionCards = applyActionCardOverrides(data.actionCards);
      
      const skillMapper = (newSkill: NewSkillData): SkillRawData => ({
        ...newSkill,
        hidden: false,
        // we wont use these
        englishName: "",
        description: "",
        targetList: [],
      });
      for (const newCh of newFormValue.newItems.characters) {
        data.characters.push({
          ...newCh,
          tags: [newCh.elementTag, newCh.weaponTag, ...newCh.tags],
          skills: newCh.skills.map(skillMapper),
          // we wont use these
          obtainable: false,
          englishName: "",
          cardFace: "",
          icon: "",
        });
      }
      for (const newEt of newFormValue.newItems.entities) {
        data.entities.push({
          ...newEt,
          skills: newEt.skills.map(skillMapper),
          // we wont use these
          description: "",
          englishName: "",
          hidden: false,
          remainAfterDie: false,
        });
      }
      for (const newAc of newFormValue.newItems.actionCards) {
        data.actionCards.push({
          ...newAc,
          // we wont use these
          obtainable: false,
          englishName: "",
          description: "",
          cardFace: "",
          targetList: [],
          relatedCharacterTags: [],
        });
      }
      setConfig({
        data,
        ...newFormValue.general,
        adjustments: newFormValue.adjustments,
      });
      setMobilePreviewing(true);
    } catch (e) {
      alert((e as Error).message || "加载数据失败");
    } finally {
      setLoading(false);
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
    if (c?.mode === "balanceAdjustment") {
      return "balance-adjustment";
    }
    return "card";
  };

  const exportImage = async (config: RenderConfig = {}) => {
    try {
      setRenderMount(captureContainer);
      // make them reflow (?)
      await new Promise((r) => setTimeout(r, 100));
      const blob = await domToBlob(captureContainer, {
        type: `image/${config.format || "png"}`,
        width: captureContainer.scrollWidth,
        height: captureContainer.scrollHeight,
        quality: config.quality || 1,
      });
      if (!blob.size) {
        return null;
      }
      return blob;
    } finally {
      setRenderMount(previewContainer);
    }
  };

  const downloadImage = async (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename()}.png`;
    link.href = objectUrl;
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const exportAndDownloadImage = async () => {
    const blob = await exportImage();
    if (blob) {
      await downloadImage(blob);
    } else {
      alert("导出图片失败");
    }
  };

  let captureContainer!: HTMLDivElement;
  let previewContainer!: HTMLDivElement;
  const [renderMount, setRenderMount] = createSignal<HTMLElement>();
  const [mobilePreviewing, setMobilePreviewing] = createSignal(false);

  onMount(async () => {
    setRenderMount(previewContainer);
    if (!loading()) {
      try {
        setLoading(true);
        remoteFetched.data = await getData(
          remoteFetched.version,
          remoteFetched.language,
        );
      } catch (e) {
        alert((e as Error).message || "加载数据失败");
      } finally {
        setLoading(false);
      }
    }
  });

  const renderImage = async (data: RenderAppOption) => {
    setConfig(data);
    const blob = await exportImage();
    if (!blob) {
      throw new Error("导出图片失败");
    }
    const buffer = new Uint8Array(await blob.arrayBuffer());
    return `data:${blob.type};base64,${buffer.toBase64()}`;
  };

  onMount(() => {
    window.renderCardImage = renderImage;
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
          <Forms
            initialValue={INITIAL_FORM_VALUE}
            versionList={versionList.state === "ready" ? versionList() : []}
            loading={loading()}
            onSubmit={onSubmitForm}
          />
        </div>
        <input type="checkbox" checked={mobilePreviewing()} hidden />
        <div class="preview-container" ref={previewContainer}>
          <div class="fixed right-6 top-2 z-1 flex flex-row gap-2">
            <button
              class="btn btn-soft btn-accent md:hidden"
              onClick={() => setMobilePreviewing(false)}
            >
              &times;
            </button>
            <button
              class="btn btn-soft btn-secondary"
              onClick={exportAndDownloadImage}
            >
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
