import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { Entity, EntityConfig } from '../../domain/types';
import { useEntityResource } from '../../hooks/useEntityResource';
import { EmptyState, Loading, StatusBadge } from '../../shared/components';

export function EntityPage({ config }: { config: EntityConfig }) {
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Entity | null>(null);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const resource = useEntityResource(config.endpoint, query);

  function openNew() {
    setEditing(null);
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, field.type === 'number' ? 0 : field.options?.[0]?.value || ''])));
    setModal(true);
  }

  function openEdit(row: Entity) {
    setEditing(row);
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, (row[field.key] as string | number) ?? ''])));
    setModal(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await resource.save(editing?.id, form);
      setModal(false);
    } catch (cause) {
      resource.setError(cause instanceof Error ? cause.message : 'Error');
    }
  }

  async function remove(id: string) {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      await resource.remove(id);
    } catch (cause) {
      resource.setError(cause instanceof Error ? cause.message : 'Error');
    }
  }

  return (
    <section className="module-view">
      <div className="module-header">
        <div>
          <span className="eyebrow">CENTRO ADMINISTRATIVO</span>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        <button className="primary-button compact" onClick={openNew}>
          <Plus size={17} /> Nuevo {config.singular}
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar en ${config.title.toLowerCase()}…`}
            aria-label={`Buscar en ${config.title.toLowerCase()}`}
          />
        </div>
        <span>{resource.rows.length} registros</span>
      </div>

      {resource.error && <div className="error-banner" role="alert">{resource.error}</div>}

      <div className="data-panel">
        {resource.loading ? <Loading /> : resource.rows.length === 0 ? (
          <EmptyState title="No hay registros" detail={`Crea el primer ${config.singular}.`} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {config.columns.map((column) => <th key={column.key}>{column.label}</th>)}
                  <th className="actions-heading"><span>Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {resource.rows.map((row) => (
                  <tr key={row.id}>
                    {config.columns.map((column) => (
                      <td key={column.key}>
                        {column.key === 'status' ? (
                          <StatusBadge value={String(row.status)} label={column.render ? column.render(row) : String(row.status)} />
                        ) : column.render ? column.render(row) : String(row[column.key] ?? '—')}
                      </td>
                    ))}
                    <td className="actions-cell">
                      <div className="row-actions" role="group" aria-label={`Acciones de ${config.singular}`}>
                        <button
                          type="button"
                          className="table-action"
                          aria-label={`Editar ${config.singular}`}
                          title={`Editar ${config.singular}`}
                          onClick={() => openEdit(row)}
                        >
                          <Pencil size={16} strokeWidth={1.9} />
                        </button>
                        <button
                          type="button"
                          className="table-action danger-link"
                          aria-label={`Eliminar ${config.singular}`}
                          title={`Eliminar ${config.singular}`}
                          onClick={() => remove(row.id)}
                        >
                          <Trash2 size={16} strokeWidth={1.9} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModal(false)}>
          <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="entity-modal-title">
            <div className="modal-header">
              <div>
                <span className="eyebrow">{editing ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}</span>
                <h2 id="entity-modal-title">{editing ? `Editar ${config.singular}` : `Nuevo ${config.singular}`}</h2>
              </div>
              <button type="button" className="icon-button" aria-label="Cerrar" onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="form-grid">
              {config.fields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  {field.type === 'select' ? (
                    <select required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}>
                      {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  ) : (
                    <input
                      required={field.required}
                      type={field.type || 'text'}
                      step={field.type === 'number' ? '0.01' : undefined}
                      value={form[field.key] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="ghost-button" onClick={() => setModal(false)}>Cancelar</button>
              <button className="primary-button compact">Guardar cambios</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
