export type Section = 'overview' | 'athletes' | 'teams' | 'venues' | 'competitions' | 'matches' | 'charges' | 'settings';
export type UserSession = { displayName: string; role: string; username: string };
export type Tenant = { id: string; name: string; slug: string; currency: string; country: string; primaryColor: string };
export type Match = { id: string; competitionName: string; sport: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number; scheduledAt: string; venue: string; status: 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'FINISHED'; period: string; clockSeconds: number };
export type Dashboard = { metrics: { athletes: number; teams: number; venues: number; competitions: number; liveMatches: number; pendingCharges: number; collected: number }; matches: Match[] };
export type SearchResult = { id: string; section: Exclude<Section, 'overview' | 'settings' | 'charges' | 'venues'>; label: string; detail: string };
export type Entity = Record<string, string | number | string[] | null> & { id: string };
export type Field = { key: string; label: string; type?: 'text' | 'date' | 'datetime-local' | 'number' | 'select'; options?: { value: string; label: string }[]; required?: boolean };
export type EntityConfig = { endpoint: string; title: string; singular: string; subtitle: string; fields: Field[]; columns: { key: string; label: string; render?: (row: Entity) => string }[] };
