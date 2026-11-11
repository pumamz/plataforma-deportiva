import { CreditCard, LayoutDashboard, MapPin, ShieldCheck, Swords, Trophy, Users, type LucideIcon } from 'lucide-react';
import type { Section } from '../domain/types';

export type NavigationItem = {
  id: Exclude<Section, 'settings'>;
  label: string;
  path: string;
  icon: LucideIcon;
  live?: boolean;
};

export const navigation: NavigationItem[] = [
  { id: 'overview', label: 'Inicio', path: '/', icon: LayoutDashboard },
  { id: 'athletes', label: 'Deportistas', path: '/deportistas', icon: Users },
  { id: 'teams', label: 'Equipos', path: '/equipos', icon: ShieldCheck },
  { id: 'venues', label: 'Sedes y canchas', path: '/sedes', icon: MapPin },
  { id: 'competitions', label: 'Campeonatos', path: '/campeonatos', icon: Trophy },
  { id: 'matches', label: 'Partidos en vivo', path: '/partidos', icon: Swords, live: true },
  { id: 'charges', label: 'Cartera y pagos', path: '/cartera', icon: CreditCard },
];

export const sectionPaths: Record<Section, string> = {
  overview: '/',
  athletes: '/deportistas',
  teams: '/equipos',
  venues: '/sedes',
  competitions: '/campeonatos',
  matches: '/partidos',
  charges: '/cartera',
  settings: '/configuracion',
};
