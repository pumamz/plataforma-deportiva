import { createContext, useContext } from 'react';
import type { Tenant, UserSession } from '../domain/types';

export type Session = { user: UserSession; tenant: Tenant };
export type AuthContextValue = {
  user: UserSession | null;
  tenant: Tenant | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  establishSession: (session: Session) => void;
  updateTenant: (tenant: Tenant) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
