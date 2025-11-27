import { overrideData } from "./constants";
import { applyOverride } from "./override";
import type { AllRawData, Language, OverrideContext, Version } from "./types";

export const ASSETS_API_ENDPOINT = `https://static-data.7shengzhaohuan.online/api/v4`;

export const getData = async (version: string, language: Language, versionList: Version[]) => {
  const data: Partial<AllRawData> = {};
  await Promise.all(
    (["characters", "action_cards", "entities", "keywords"] as const).map(
      async (category) => {
        const key = category === "action_cards" ? "actionCards" : category;
        data[key] = await fetch(
          `${ASSETS_API_ENDPOINT}/data/${version}/${language}/${category}`
        ).then(async (r) =>
          r.ok
            ? (
                await r.json()
              ).data
            : Promise.reject(new Error(await r.text()))
        );
      }
    )
  );
  const betaVersion = "v9999.0.0" as Version;
  const latestVersion = versionList.at(-1) ?? betaVersion;
  const overrideContext: OverrideContext = {
    version:
      version === "latest"
        ? latestVersion
        : version.endsWith("-beta")
        ? betaVersion
        : (version as Version),
    language: language,
  };
  const overridedData = applyOverride(
    structuredClone(data) as AllRawData,
    overrideData,
    overrideContext
  );
  return overridedData as AllRawData;
};
