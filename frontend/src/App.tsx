import { useEffect, useState } from 'react';
import { api, tokenStore } from './api';
import { AppShell } from './app/AppShell';
import { entityConfigs } from './config/entities';
import type { Section, Tenant, UserSession } from './domain/types';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { EntityPage } from './features/entities/EntityPage';
import { MatchesPage } from './features/matches/MatchesPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [section, setSection] = useState<Section>('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, setTheme, toggleTheme } = useTheme(tenant?.primaryColor);
  useEffect(() => { if (!tokenStore.get()) return; api<{ user: UserSession; tenant: Tenant }>('/api/me').then((session) => { setUser(session.user); setTenant(session.tenant); }).catch(() => tokenStore.clear()); }, []);
  function navigate(next: Section) { setSection(next); if (next === 'overview') setRefreshKey((value) => value + 1); }
  function logout() { tokenStore.clear(); setUser(null); setTenant(null); }
  if (!user || !tenant) return <LoginPage onLogin={(nextUser, nextTenant) => { setUser(nextUser); setTenant(nextTenant); }} />;
  const content = section === 'overview' ? <DashboardPage refreshKey={refreshKey} navigate={navigate} /> : section === 'matches' ? <MatchesPage /> : section === 'settings' ? <SettingsPage tenant={tenant} theme={theme} onThemeChange={setTheme} onUpdated={setTenant} /> : <EntityPage config={entityConfigs[section]} />;
  return <AppShell section={section} tenant={tenant} user={user} theme={theme} onThemeToggle={toggleTheme} onNavigate={navigate} onLogout={logout}>{content}</AppShell>;
}
