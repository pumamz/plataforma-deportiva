import { ChevronDown, LogOut, Settings, Sparkles, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { navigation } from '../app/navigation';
import { Brand } from '../components/common/Brand';
import { useAuth } from '../context/auth-context';
import { useSidebar } from '../context/sidebar-context';
import { cn } from '../lib/cn';

export function AppSidebar() {
  const { tenant, logout } = useAuth();
  const { isMobileOpen, closeMobile } = useSidebar();
  const navigate = useNavigate();

  if (!tenant) return null;

  const initials = tenant.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const signOut = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <aside className={cn('sidebar', isMobileOpen && 'open')}>
      <div className="sidebar-brand-row">
        <Brand />
        <button className="mobile-close" aria-label="Cerrar menú" onClick={closeMobile}><X /></button>
      </div>

      <div className="tenant-switcher">
        <div className="tenant-logo">{initials}</div>
        <div><span>ORGANIZACIÓN</span><strong>{tenant.name}</strong></div>
        <ChevronDown size={16} aria-hidden="true" />
      </div>

      <nav aria-label="Navegación principal">
        {navigation.map(({ id, label, path, icon: Icon, live }) => (
          <NavLink key={id} to={path} end={path === '/'} className={({ isActive }) => cn('sidebar-link', isActive && 'active')} onClick={closeMobile}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
            {live ? <b>LIVE</b> : null}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/configuracion" className={({ isActive }) => cn('sidebar-link', isActive && 'active')} onClick={closeMobile}>
          <Settings size={18} aria-hidden="true" /> Configuración
        </NavLink>
        <button onClick={signOut}><LogOut size={18} aria-hidden="true" /> Cerrar sesión</button>
        <div className="pilot-card"><Sparkles size={18} /><div><strong>Piloto operativo</strong><span>Ecuador · USD</span></div></div>
      </div>
    </aside>
  );
}
