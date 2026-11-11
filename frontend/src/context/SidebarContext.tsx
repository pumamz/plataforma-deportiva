import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { SidebarContext } from './sidebar-context';

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobile = useCallback(() => setIsMobileOpen((current) => !current), []);
  const value = useMemo(() => ({ isMobileOpen, openMobile, closeMobile, toggleMobile }), [closeMobile, isMobileOpen, openMobile, toggleMobile]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
