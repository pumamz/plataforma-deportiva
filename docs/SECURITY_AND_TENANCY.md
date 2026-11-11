# Seguridad y multi-tenancy

## Frontera de tenant

El `tenantId` se obtiene del JWT verificado; nunca se acepta desde el cuerpo del cliente como fuente de autoridad. Las consultas administrativas incluyen `tenantId` en lectura, actualización y eliminación. Las salas WebSocket se derivan del mismo contexto autenticado.

## Controles implementados

- Contraseñas almacenadas con bcrypt.
- JWT con expiración y secreto externo en producción.
- Autorización por roles en mutaciones y marcador.
- Validación Zod de entradas del catálogo y comandos realtime.
- Helmet para cabeceras HTTP seguras.
- CORS restringido al frontend configurado.
- Rate limit en autenticación.
- Límite del cuerpo JSON.
- `request-id` por respuesta para correlación.
- Seed y sincronización de esquema prohibidos en producción.

## Controles requeridos antes de comercializar

- Migraciones versionadas y rollback probado.
- Rotación de secretos y gestor de credenciales.
- Refresh tokens revocables o sesión centralizada.
- MFA para administradores del proveedor.
- Auditoría inmutable de pagos, permisos y marcador.
- Pruebas automatizadas de acceso cruzado entre tenants.
- Cifrado de backups, política de retención y restauración ensayada.
- WAF, límites por tenant y protección antiabuso.
- Revisión OWASP ASVS y pentest externo.
- Política de privacidad y tratamiento de datos de menores.

## Regla operativa

Nunca usar las credenciales `admin/admin123` fuera de la demo local. En producción deben existir secretos únicos, cuentas iniciales de un solo uso y cambio obligatorio de contraseña.

