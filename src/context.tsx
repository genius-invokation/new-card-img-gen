import { createContext, useContext, type Accessor } from "solid-js";
import type { GlobalSettingsValue, RenderContext } from "./types";

export const GlobalSettings = createContext<GlobalSettingsValue>();
export const useGlobalSettings = () => {
  const ctx = useContext(GlobalSettings);
  if (!ctx) {
    throw new Error(
      "AppContext not found: ensure your component is wrapped in <AppContext.Provider>",
    );
  }
  return ctx;
};

const RenderContextSolid = createContext<Accessor<RenderContext>>();
export const RenderContextProvider = RenderContextSolid.Provider;
export const useRenderContext = () => {
	const ctx = useContext(RenderContextSolid);
	if (!ctx) {
		throw new Error(
			"RenderContext not found: ensure your component is wrapped in <RenderContextProvider>",
		);
	}
	return ctx;
}