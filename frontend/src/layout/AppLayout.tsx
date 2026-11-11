import { Outlet } from 'react-router';
import { SidebarProvider } from '../context/SidebarContext';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { Backdrop } from './Backdrop';

function LayoutContent() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <Backdrop />
      <main className="app-main">
        <AppHeader />
        <div className="content"><Outlet /></div>
      </main>
    </div>
  );
}

export function AppLayout() {
  return <SidebarProvider><LayoutContent /></SidebarProvider>;
}
