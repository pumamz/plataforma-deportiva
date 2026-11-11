# Guion de demo empresarial — 10 minutos

## Preparación

```bash
cd sports-platform
docker compose up -d --build
npm run test:e2e
```

Confirmar:

```bash
curl http://localhost:3002/api/health/ready
docker compose ps
```

Abrir `http://localhost:5174` y usar únicamente las credenciales de demo `admin/admin123`.

## Minuto 0–2: propuesta SaaS

1. Presentar el dashboard como una organización activa: Academia Central.
2. Mostrar métricas, agenda, cartera y disciplinas.
3. Explicar que la misma plataforma sirve a varias organizaciones con aislamiento por tenant.

## Minuto 2–5: operación administrativa

1. Abrir Deportistas y buscar una ficha.
2. Mostrar Equipos, Sedes y Campeonatos.
3. Crear o editar un registro de prueba.
4. Usar la búsqueda global para demostrar navegación transversal.

## Minuto 5–7: cartera

1. Abrir Cartera y pagos.
2. Mostrar cargo, vencimiento, valor pagado, estado y referencia.
3. Aclarar que el MVP registra pagos manuales; pasarela y facturación están en roadmap.

## Minuto 7–9: tiempo real

1. Abrir Partidos en vivo.
2. Mostrar estado “SINCRONIZADO”.
3. Incrementar un marcador y observar el cambio inmediato.
4. Explicar salas por tenant, comando autenticado, confirmación y persistencia MySQL.
5. Si hay dos pantallas, abrir ambas y mostrar propagación sin recargar.

## Minuto 9–10: arquitectura y cierre

1. Mostrar `docs/C4_MODEL.md` y el ADR del monolito modular.
2. Mencionar build limpio y prueba E2E multi-cliente.
3. Cerrar con la matriz de capacidades, diferenciando claramente demo y producción.

## Frases que deben evitarse

- “Está listo para producción”.
- “Soporta escala ilimitada”.
- “La facturación o pagos ya están integrados”.
- “Todos los formatos deportivos están automatizados”.

La presentación debe vender una base seria y demostrable, no promesas técnicas imposibles de defender.

