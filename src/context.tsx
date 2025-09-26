import { createContext, useContext, type Accessor } from "solid-js";
import type { AppContextValue, RenderContext } from "./types";

export const AppContext = createContext<AppContextValue>();
export const useAppContext = () => {
  const ctx = useContext(AppContext);
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