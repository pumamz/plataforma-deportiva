import { CircleUserRound, Menu, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { api } from '../api';
import { sectionPaths } from '../app/navigation';
import { useAuth } from '../context/auth-context';
import { useSidebar } from '../context/sidebar-context';
import { useAppTheme } from '../context/theme-context';
import type { SearchResult } from '../domain/types';

export function AppHeader() {
  const { user } = useAuth();
  const { openMobile } = useSidebar();
  const { theme, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) return;
    const timer = window.setTimeout(() => {
      api<SearchResult[]>(`/api/search?q=${encodeURIComponent(normalized)}`).then(setResults).catch(() => setResults([]));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', focusSearch);
    return () => document.removeEventListener('keydown', focusSearch);
  }, []);

  const openResult = (result: SearchResult) => {
    navigate(sectionPaths[result.section]);
    setQuery('');
    setResults([]);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) setResults([]);
  };

  return (
    <header className="topbar">
      <button className="menu-button" aria-label="Abrir menú" onClick={openMobile}><Menu /></button>
      <div className="top-search">
        <Search size={18} aria-hidden="true" />
        <input ref={inputRef} value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Buscar deportistas, equipos, partidos…" aria-label="Búsqueda global" />
        <kbd>Ctrl K</kbd>
        {query.trim().length >= 2 ? (
          <div className="search-results">
            {results.length ? results.map((result) => (
              <button key={`${result.section}-${result.id}`} onClick={() => openResult(result)}>
                <strong>{result.label}</strong><span>{result.detail}</span>
              </button>
            )) : <span>Sin resultados</span>}
          </div>
        ) : null}
      </div>

      <nav className="top-links" aria-label="Accesos rápidos">
        <NavLink to="/" end>Resumen</NavLink>
        <NavLink to="/partidos">Partidos</NavLink>
        <NavLink to="/equipos">Equipos</NavLink>
        <NavLink to="/campeonatos">Campeonatos</NavLink>
      </nav>

      <div className="top-actions">
        <button className="theme-toggle" aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`} title={`Tema ${theme === 'dark' ? 'claro' : 'oscuro'}`} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="profile">
          <CircleUserRound size={28} />
          <div><strong>{user?.displayName}</strong><span>{user?.role === 'ORG_ADMIN' ? 'Administrador' : user?.role}</span></div>
        </div>
      </div>
    </header>
  );
}
