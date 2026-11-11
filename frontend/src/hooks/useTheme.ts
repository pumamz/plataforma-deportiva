import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
const STORAGE_KEY = 'sports-ui-theme-v1';

export function useTheme(accentColor?: string) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(STORAGE_KEY, theme); }, [theme]);
  useEffect(() => { if (accentColor) document.documentElement.style.setProperty('--accent', accentColor); }, [accentColor]);
  return { theme, setTheme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') };
}
