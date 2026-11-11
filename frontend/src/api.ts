export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const tokenStore = {
  get: () => localStorage.getItem('sports_token'),
  set: (token: string) => localStorage.setItem('sports_token', token),
  clear: () => localStorage.removeItem('sports_token'),
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = tokenStore.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'No se pudo completar la operación' }));
    throw new Error(body.message || 'No se pudo completar la operación');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
