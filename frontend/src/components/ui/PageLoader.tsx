import { cn } from '../../lib/cn';

export function PageLoader({ fullScreen = false, label = 'Cargando información…' }: { fullScreen?: boolean; label?: string }) {
  return (
    <div className={cn('loading', fullScreen && 'min-h-screen')} role="status" aria-live="polite">
      <span />
      <p>{label}</p>
    </div>
  );
}
