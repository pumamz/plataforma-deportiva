# Arquitectura del frontend

El frontend sigue el patrón probado en UDIPSAI, adaptado al dominio deportivo y depurado para evitar dependencias innecesarias.

## Flujo principal

```text
main.tsx
  └─ App.tsx
      └─ AppProviders
          ├─ AuthProvider
          ├─ ThemeProvider
          └─ BrowserRouter
              └─ AppRoutes
                  ├─ LoginPage
                  └─ ProtectedRoute
                      └─ AppLayout
                          ├─ AppSidebar
                          ├─ Backdrop
                          ├─ AppHeader
                          └─ Outlet (páginas lazy)
```

## Responsabilidades

- `app/`: composición global, providers y navegación declarativa.
- `routes/`: definición central de rutas y carga diferida por módulo.
- `layout/`: shell autenticado; header, sidebar, backdrop y contenido.
- `context/`: sesión, tema y estado responsive del sidebar.
- `components/ui/`: primitivas reutilizables sin conocimiento del dominio.
- `components/common/`: piezas compartidas de producto y marca.
- `features/`: páginas y comportamiento por capacidad de negocio.
- `hooks/`: lógica reutilizable con estado o ciclo de vida.
- `domain/`: contratos TypeScript del negocio.
- `lib/`: utilidades puras sin dependencias de React.

## Navegación

Las rutas usan React Router y URL reales. Los módulos se cargan mediante `React.lazy`, con `Suspense` global. La sesión está protegida por `ProtectedRoute`; el layout usa `Outlet` para evitar acoplar navegación y páginas.

## Estado global

- `AuthProvider`: restaura la sesión, mantiene usuario/tenant y expone logout.
- `ThemeProvider`: persiste claro/oscuro y aplica el color del tenant.
- `SidebarProvider`: controla exclusivamente el drawer móvil.

El estado de formularios, tablas y partidos permanece local a cada feature.

## Calidad y compilación

```bash
npm run typecheck -w frontend
npm run lint -w frontend
npm run build -w frontend
npm run test:e2e
```

El build de Vite produce chunks independientes para autenticación, dashboard, entidades, partidos y configuración.

## Reglas para nuevos módulos

1. Crear la página dentro de `features/<modulo>/`.
2. Mantener las llamadas de datos dentro del feature o extraerlas a un servicio dedicado cuando crezcan.
3. Registrar una ruta lazy en `routes/config.tsx`.
4. Añadir la entrada declarativa en `app/navigation.ts`.
5. Reutilizar el layout y los componentes UI; no duplicar headers, sidebars ni modales.
6. Ejecutar typecheck, lint, build y E2E antes de publicar.
