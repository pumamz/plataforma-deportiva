import { createContext, useContext } from 'react';
import type { Theme } from '../hooks/useTheme';

export type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void };
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme debe utilizarse dentro de ThemeProvider');
  return context;
}
