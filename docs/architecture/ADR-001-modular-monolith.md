# ADR-001: Monolito modular como arquitectura inicial

## Estado

Aceptado.

## Contexto

El producto combina gestión transaccional multiempresa, cartera, competencias y operación en tiempo real. El MVP necesita consistencia y velocidad de entrega sin acoplar los dominios entre sí.

## Decisión

Usar un monolito modular con límites explícitos por dominio. Cada módulo expone rutas HTTP, casos de uso y contratos propios; infraestructura, autenticación y observabilidad viven en `core`. Ningún módulo accede a datos de otro tenant sin el contexto de autenticación.

El frontend se organiza por dominio (`features`), componentes compartidos (`shared`), contratos (`domain`) y composición (`app`).

## Extracción futura

`matches/realtime`, `billing` y `notifications` son candidatos a servicios independientes cuando existan necesidades comprobadas de escalado, aislamiento o ciclos de despliegue distintos. La comunicación futura usará eventos con outbox, no llamadas cruzadas a tablas.

## Consecuencias

- Un despliegue y transacciones locales durante el MVP.
- Límites verificables y menor complejidad operativa.
- Migraciones, auditoría, métricas y pruebas contractuales son requisitos previos al despliegue comercial.
