import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, tokenStore } from '../api';
import type { Tenant, UserSession } from '../domain/types';
import { AuthContext, type AuthContextValue, type Session } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(tokenStore.get()));

  useEffect(() => {
    if (!tokenStore.get()) return;
    api<Session>('/api/me')
      .then(({ user: nextUser, tenant: nextTenant }) => {
        setUser(nextUser);
        setTenant(nextTenant);
      })
      .catch(() => tokenStore.clear())
      .finally(() => setIsBootstrapping(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    tenant,
    isBootstrapping,
    isAuthenticated: Boolean(user && tenant),
    establishSession: ({ user: nextUser, tenant: nextTenant }) => {
      setUser(nextUser);
      setTenant(nextTenant);
    },
    updateTenant: setTenant,
    logout: () => {
      tokenStore.clear();
      setUser(null);
      setTenant(null);
    },
  }), [isBootstrapping, tenant, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
