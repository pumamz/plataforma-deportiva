import { lazy, type ComponentType } from 'react';
import { Navigate, useRoutes, type RouteObject } from 'react-router';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { entityConfigs } from '../config/entities';
import { AppLayout } from '../layout/AppLayout';

function lazyNamed<T extends object>(loader: () => Promise<T>, name: keyof T) {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType }));
}

const LoginPage = lazyNamed(() => import('../features/auth/LoginPage'), 'LoginPage');
const DashboardPage = lazyNamed(() => import('../features/dashboard/DashboardPage'), 'DashboardPage');
const EntityPage = lazyNamed(() => import('../features/entities/EntityPage'), 'EntityPage') as ComponentType<{ config: (typeof entityConfigs)[keyof typeof entityConfigs] }>;
const MatchesPage = lazyNamed(() => import('../features/matches/MatchesPage'), 'MatchesPage');
const SettingsPage = lazyNamed(() => import('../features/settings/SettingsPage'), 'SettingsPage');

const privateRoutes: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'deportistas', element: <EntityPage config={entityConfigs.athletes} /> },
  { path: 'equipos', element: <EntityPage config={entityConfigs.teams} /> },
  { path: 'sedes', element: <EntityPage config={entityConfigs.venues} /> },
  { path: 'campeonatos', element: <EntityPage config={entityConfigs.competitions} /> },
  { path: 'partidos', element: <MatchesPage /> },
  { path: 'cartera', element: <EntityPage config={entityConfigs.charges} /> },
  { path: 'configuracion', element: <SettingsPage /> },
];

export function AppRoutes() {
  return useRoutes([
    { path: '/signin', element: <LoginPage /> },
    {
      element: <ProtectedRoute />,
      children: [{ element: <AppLayout />, children: privateRoutes }],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);
}
