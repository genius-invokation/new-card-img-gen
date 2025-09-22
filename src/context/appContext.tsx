import { createContext, useContext } from 'solid-js';
import type { AppContextValue } from '../types/app';

export const AppContext = createContext<AppContextValue>();
export const useAppContext = () => useContext(AppContext)!;
