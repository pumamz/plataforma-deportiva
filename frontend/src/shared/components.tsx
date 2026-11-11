import { Building2 } from 'lucide-react';

export function TeamCrest({ name, side }: { name: string; side: 'home' | 'away' }) { return <div className={`team-crest ${side}`}>{name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</div>; }
export function MiniCrest({ name }: { name: string }) { return <span className="mini-crest">{name.slice(0, 1)}</span>; }
export function StatusBadge({ value, label }: { value: string; label: string }) { return <span className={`status-badge status-${value.toLowerCase()}`}>{label}</span>; }
export function Loading() { return <div className="loading" role="status"><span /><p>Cargando información…</p></div>; }
export function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="empty-state"><Building2 size={28} /><strong>{title}</strong><span>{detail}</span></div>; }
