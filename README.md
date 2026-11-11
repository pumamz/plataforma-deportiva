# Plataforma Deportiva

Aplicación separada basada técnicamente en CatoBots. CatoBots permanece intacto.

Base modular de un SaaS multiempresa para academias, clubes y organizadores deportivos. La demo integra React, API TypeScript, MySQL y comunicación WebSocket autenticada.

## Alcance del piloto

- SaaS multiempresa con aislamiento por `tenantId`.
- Administración de deportistas, equipos, sedes/canchas, campeonatos y partidos.
- Fútbol, baloncesto y vóley como deportes iniciales.
- Cartera manual en USD con conceptos configurables y comprobantes/referencias.
- Marcador en tiempo real mediante Socket.IO con controles autenticados.
- Roles: proveedor, administrador, personal/entrenador y árbitro/anotador.
- Diseño oscuro basado en la primera referencia entregada.

## Inicio rápido con Docker

```bash
docker compose up --build
```

Abre `http://localhost:5174`. Usuario inicial: `admin`; contraseña: `admin123`.

Estas credenciales son únicamente para desarrollo. Deben configurarse mediante variables de entorno antes de cualquier despliegue real.

## Desarrollo local

```bash
npm install
npm run dev:server
npm run dev:frontend
```

El backend usa el puerto `3002` y el frontend el `5174`.

## Verificación

Con los servicios levantados, ejecuta la prueba completa de API, MySQL y Socket.IO:

```bash
npm run build
npm run test:e2e
```

La prueba cubre API, persistencia MySQL y propagación WebSocket entre dos clientes simultáneos.

## Documentación empresarial

- [Visión ejecutiva](docs/EXECUTIVE_OVERVIEW.md)
- [Arquitectura y modelo C4](docs/C4_MODEL.md)
- [Decisión: monolito modular](docs/architecture/ADR-001-modular-monolith.md)
- [Contrato WebSocket](docs/REALTIME_CONTRACT.md)
- [Seguridad y multi-tenancy](docs/SECURITY_AND_TENANCY.md)
- [Matriz de capacidades](docs/CAPABILITY_MATRIX.md)
- [Guion de demo de 10 minutos](docs/DEMO_RUNBOOK.md)
- [Checklist de producción](docs/PRODUCTION_READINESS.md)

## Estado honesto

El entorno actual es una demo empresarial funcional y verificable. No debe desplegarse como servicio comercial sin completar migraciones, auditoría, backups, observabilidad, endurecimiento de identidad, pruebas de carga y los gates descritos en la checklist de producción.
