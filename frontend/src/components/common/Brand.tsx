export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Plataforma Deportiva">
      <span className="brand-mark" aria-hidden="true">PD</span>
      {compact ? null : <span>Plataforma <strong>Deportiva</strong></span>}
    </div>
  );
}
