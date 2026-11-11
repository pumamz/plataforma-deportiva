import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { api, tokenStore } from '../../api';
import { useAuth } from '../../context/auth-context';
import type { Tenant, UserSession } from '../../domain/types';

export function LoginPage() {
  const { establishSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const result = await api<{ token: string; user: UserSession; tenant: Tenant }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password, tenant: 'demo-academy' }) }); tokenStore.set(result.token); establishSession({ user: result.user, tenant: result.tenant }); navigate('/', { replace: true }); } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión'); } finally { setLoading(false); } }
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <main className="login-shell"><section className="login-art"><div className="brand brand-large"><span className="brand-mark">PD</span><span>Plataforma <strong>Deportiva</strong></span></div><div className="login-copy"><span className="eyebrow">GESTIÓN DEPORTIVA EN TIEMPO REAL</span><h1>Administra cada jugada.</h1><p>Academias, deportistas, pagos y campeonatos en una sola plataforma.</p></div><div className="art-score"><span>EN VIVO</span><strong>2 <small>—</small> 1</strong><p>Halcones U14 · Cóndores U14</p></div></section><section className="login-panel"><form className="login-card" onSubmit={submit}><div><span className="eyebrow">PILOTO ECUADOR · USD</span><h2>Bienvenido</h2><p>Ingresa al centro de administración.</p></div><label>Usuario<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>{error && <div className="error-banner" role="alert">{error}</div>}<button className="primary-button" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar al sistema'}</button><p className="login-hint">Acceso piloto: admin / admin123</p></form></section></main>;
}
