import { useSidebar } from '../context/sidebar-context';

export function Backdrop() {
  const { isMobileOpen, closeMobile } = useSidebar();
  if (!isMobileOpen) return null;
  return <button className="sidebar-backdrop" aria-label="Cerrar navegación" onClick={closeMobile} />;
}
