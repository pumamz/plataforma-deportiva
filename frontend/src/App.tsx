import { Suspense } from 'react';
import { AppProviders } from './app/AppProviders';
import { PageLoader } from './components/ui/PageLoader';
import { AppRoutes } from './routes/config';

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<PageLoader fullScreen />}>
        <AppRoutes />
      </Suspense>
    </AppProviders>
  );
}
