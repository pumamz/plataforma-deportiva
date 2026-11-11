import type { Entity } from '../domain/types';

export const sportOptions = [{ value: 'FOOTBALL', label: 'Fútbol' }, { value: 'BASKETBALL', label: 'Baloncesto' }, { value: 'VOLLEYBALL', label: 'Vóley' }];
export const sportLabel = (value: string) => sportOptions.find((item) => item.value === value)?.label || value;
export const formatLabel = (row: Entity) => ({ LEAGUE: 'Liga', GROUPS: 'Grupos', KNOCKOUT: 'Eliminación' } as Record<string, string>)[String(row.format)] || String(row.format || '');
export const statusLabel = (row: Entity) => ({ ACTIVE: 'Activo', INACTIVE: 'Inactivo', AVAILABLE: 'Disponible', MAINTENANCE: 'Mantenimiento', CLOSED: 'Cerrada', DRAFT: 'Borrador', FINISHED: 'Finalizado', PENDING: 'Pendiente', PARTIAL: 'Parcial', PAID: 'Pagado', OVERDUE: 'Vencido' } as Record<string, string>)[String(row.status)] || String(row.status || '');
export const money = (value: unknown) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
export function shortDate(value: string) { if (!value) return '—'; const normalized = /^\d{4}-\d{2}-\d{2}/.test(value) ? `${value.slice(0, 10)}T12:00:00` : value; const date = new Date(normalized); return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(date); }
export const clock = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
