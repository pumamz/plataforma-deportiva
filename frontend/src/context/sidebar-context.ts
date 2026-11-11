import { createContext, useContext } from 'react';

export type SidebarContextValue = { isMobileOpen: boolean; openMobile: () => void; closeMobile: () => void; toggleMobile: () => void };
export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar debe utilizarse dentro de SidebarProvider');
  return context;
}
