import { useMemo, type ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from './auth-context';
import { ThemeContext } from './theme-context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { tenant } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme(tenant?.primaryColor);
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
