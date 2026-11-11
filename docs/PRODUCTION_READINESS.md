# Checklist de preparación comercial

## Gate 1 — demo empresarial

- [x] Build reproducible.
- [x] Docker Compose con MySQL persistente.
- [x] Autenticación y roles básicos.
- [x] Aislamiento por tenant en operaciones principales.
- [x] WebSocket autenticado y versionado.
- [x] Prueba E2E de API, base de datos y dos clientes realtime.
- [x] Documentación de arquitectura y guion de demo.

## Gate 2 — piloto controlado

- [ ] Migraciones y rollback.
- [ ] Gestión de usuarios desde UI.
- [ ] Auditoría de acciones críticas.
- [ ] Backups automáticos y prueba de restauración.
- [ ] Logs estructurados, métricas y alertas.
- [ ] Pruebas de integración por módulo y aislamiento tenant.
- [ ] Política de privacidad para datos de menores.
- [ ] Entornos separados de desarrollo, staging y producción.

## Gate 3 — venta comercial

- [ ] SSO/MFA y recuperación segura de cuenta.
- [ ] Alta disponibilidad y escalado horizontal de Socket.IO.
- [ ] Cola/outbox para notificaciones y procesos durables.
- [ ] Pasarela de pagos y conciliación.
- [ ] Facturación electrónica según mercado.
- [ ] Pruebas de carga con objetivos de latencia documentados.
- [ ] Pentest y revisión OWASP.
- [ ] SLA, soporte, recuperación ante desastres y runbooks.

## Criterios técnicos sugeridos

- Disponibilidad mensual objetivo: 99,9 % para planes comerciales.
- p95 API administrativa: menos de 400 ms bajo carga objetivo.
- p95 propagación realtime: menos de 500 ms en región principal.
- RPO inicial: 15 minutos; RTO inicial: 2 horas.
- Cero accesos cruzados de tenant en pruebas automatizadas.

Estos valores son objetivos por validar mediante pruebas de carga; no son garantías actuales.

