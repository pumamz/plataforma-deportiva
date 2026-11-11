# Modelo C4 textual

## Nivel 1 — contexto

```text
[Proveedor SaaS] ─ administra clientes y operación ─┐
[Academia/Club] ─ gestiona deporte y cartera ───────┼─> [Plataforma Deportiva]
[Anotador] ─ actualiza marcador en vivo ────────────┤
[Público] ─ consulta resultados ────────────────────┘
                                                      │
                                                      └─> [MySQL]
```

## Nivel 2 — contenedores

```text
[Navegador]
  React + TypeScript + Vite
       │ HTTPS / JSON
       │ WebSocket / Socket.IO
       ▼
[API modular]
  Express + TypeScript
  autenticación, dominios, realtime, validación
       │ SQL
       ▼
[MySQL]
  persistencia transaccional multi-tenant
```

En desarrollo los contenedores se orquestan con Docker Compose. El frontend y el API son reemplazables de forma independiente; MySQL conserva el volumen persistente.

## Nivel 3 — componentes del API

```text
core/
  configuración validada, contexto de autenticación, errores HTTP

modules/auth/
  login, sesión, emisión y verificación de JWT

modules/catalog/
  deportistas, equipos, sedes, competencias y cartera

modules/matches/
  partidos, comandos del marcador, salas tenant y reloj

modules/dashboard + search + tenancy/
  proyecciones operativas, búsqueda y configuración organizacional

infrastructure/
  Sequelize, MySQL, seed de demo y arranque
```

## Nivel 3 — componentes del frontend

```text
app/       composición, sesión, navegación y shell
features/  auth, dashboard, catálogo, partidos y configuración
services/  cliente HTTP y conexión realtime
hooks/     estado reusable y sincronización
domain/    contratos TypeScript
shared/    componentes visuales y formateadores
config/    definición declarativa de módulos administrativos
```

## Decisión de escalado

El sistema comienza como monolito modular para conservar transacciones y simplicidad operativa. `matches/realtime`, `billing` y `notifications` solo se extraerán cuando necesiten escalado o despliegue independiente. Para múltiples instancias WebSocket se incorporará Redis Adapter; para eventos durables, outbox transaccional.

