import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/auth-context';
import { PageLoader } from '../ui/PageLoader';

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) return <PageLoader fullScreen label="Restaurando sesión…" />;
  if (!isAuthenticated) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
