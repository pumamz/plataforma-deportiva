import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { Entity } from '../domain/types';

export function useEntityResource(endpoint: string, query: string) {
  const [rows, setRows] = useState<Entity[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); try { setRows(await api<Entity[]>(`/api/${endpoint}?q=${encodeURIComponent(query)}`)); setError(''); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Error'); } finally { setLoading(false); } }, [endpoint, query]);
  useEffect(() => { const timer = window.setTimeout(load, 200); return () => window.clearTimeout(timer); }, [load]);
  async function remove(id: string) { await api(`/api/${endpoint}/${id}`, { method: 'DELETE' }); await load(); }
  async function save(id: string | undefined, form: Record<string, string | number>) { await api(id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(form) }); await load(); }
  return { rows, loading, error, setError, remove, save };
}
