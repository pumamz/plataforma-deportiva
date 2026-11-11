# Contrato WebSocket de partidos

## Conexión

- Transporte: Socket.IO sobre WebSocket.
- Autenticación: JWT en `handshake.auth.token`.
- Aislamiento: cada conexión entra únicamente a `tenant:{tenantId}`.
- Roles con comandos: `PROVIDER_ADMIN`, `ORG_ADMIN`, `SCOREKEEPER`.

Una conexión sin token, con token vencido o con tenant inválido debe rechazarse antes de unirse a una sala.

## Comando versionado

Evento: `matches:v1:command`

```json
{
  "commandId": "uuid-o-identificador-idempotente",
  "matchId": "uuid-del-partido",
  "action": "HOME_PLUS"
}
```

Acciones admitidas: `HOME_PLUS`, `HOME_MINUS`, `AWAY_PLUS`, `AWAY_MINUS`, `START`, `PAUSE`, `FINISH`.

Confirmación:

```json
{ "ok": true, "commandId": "..." }
```

Los errores responden `ok: false` y un mensaje seguro. El cliente usa timeout de tres segundos y conserva una única conexión activa por pantalla.

## Evento versionado

Evento: `matches:v1:update`

```json
{
  "version": 1,
  "tenantId": "uuid",
  "occurredAt": "2026-11-10T19:00:00.000Z",
  "matches": []
}
```

La prueba E2E abre dos clientes simultáneos: un cliente envía el comando y otro recibe el evento; después consulta la API para comprobar persistencia en MySQL.

## Evolución prevista

- Redis Adapter para fan-out entre réplicas.
- Idempotencia persistente por `commandId`.
- Secuencia monotónica por partido y recuperación de eventos perdidos.
- Outbox para eventos de dominio durables.
- Métricas de conexiones, latencia de propagación y comandos rechazados.

