import { createContext, useContext } from 'solid-js';
import type { AppContextValue } from '../types/app';

export const AppContext = createContext<AppContextValue>();
export const useAppContext = () => {
	const ctx = useContext(AppContext);
	if (!ctx) {
		throw new Error('AppContext not found: ensure your component is wrapped in <AppContext.Provider>');
	}
	return ctx;
};
