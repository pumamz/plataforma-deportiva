# Arquitectura de Plataforma Deportiva

## Objetivo

SaaS multiempresa para academias, clubes y organizadores. La unidad de aislamiento es `tenantId`; toda lectura, escritura y sala WebSocket debe incluirla.

## Capas

```text
frontend/src/
  domain/           contratos de UI
  config/           metadatos declarativos
  shared/           componentes y utilidades sin dominio
  features/         páginas y casos de uso por dominio

server/src/
  core/             configuración, autenticación, errores HTTP
  modules/catalog/  deportistas, equipos, sedes, torneos y cartera
  modules/matches/  comandos y eventos WebSocket versionados
  models.ts         persistencia Sequelize (siguiente extracción: un modelo por módulo)
```

## Tiempo real

- Sala: `tenant:{tenantId}`.
- Comando: `matches:v1:command` con `commandId`, `matchId` y `action`.
- Evento: `matches:v1:update` con versión, tenant, fecha y snapshot.
- Autorización de comandos: proveedor, administrador o anotador.
- Confirmación obligatoria y timeout en el cliente.

## Reglas de producción

- `JWT_SECRET` fuerte y externo.
- `ENABLE_SCHEMA_SYNC=false` y `SEED_DEMO=false` obligatorios.
- Migraciones versionadas antes del primer despliegue comercial.
- TLS, backups, métricas, trazas, auditoría y pruebas de carga antes de vender el servicio.

## Escalado

El API es stateless salvo Socket.IO. Para escalar horizontalmente, el siguiente paso es un adaptador Redis para salas/eventos y un outbox transaccional. Pagos y notificaciones se extraen solo cuando tengan carga o ciclo de despliegue independiente.
