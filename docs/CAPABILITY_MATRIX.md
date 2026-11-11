# Matriz de capacidades

| Capacidad | Estado demo | Evidencia | Siguiente nivel |
|---|---|---|---|
| Multiempresa | Operativa | Consultas y salas por `tenantId` | Pruebas de aislamiento exhaustivas |
| Autenticación | Operativa | Login, JWT, `/api/me` | Refresh, MFA y revocación |
| Deportistas | Operativa | CRUD, búsqueda y estados | Documentos, historial y consentimientos |
| Equipos | Operativa | CRUD por deporte/categoría | Plantillas y asignaciones relacionales |
| Sedes/canchas | Operativa | CRUD y disponibilidad | Reservas, horarios y mantenimiento |
| Campeonatos | Base operativa | Liga/grupos/eliminación configurables | Fixture, tablas y llaves automáticas |
| Partidos | Operativa | Agenda, creación y estados | Actas, incidencias y reglas por deporte |
| Marcador realtime | Operativa | WebSocket multi-cliente + persistencia | Redis, secuencias e idempotencia durable |
| Cartera | Base operativa | Cargos, pagos manuales y resumen | Pasarela, conciliación y facturación SRI |
| Personalización | Base operativa | Nombre y color por organización | Logo, dominio y white-label completo |
| Portal público | API disponible | Partidos por slug | Experiencia pública y SEO |
| Observabilidad | Inicial | Health/readiness y request ID | Logs estructurados, métricas y trazas |
| Alta disponibilidad | No incluida | — | Réplicas, Redis y estrategia DR |

“Operativa” significa demostrable en el entorno Docker actual; no implica certificación de producción.

