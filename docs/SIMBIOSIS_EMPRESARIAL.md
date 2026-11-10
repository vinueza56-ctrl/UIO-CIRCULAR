# Simbiosis empresarial UIO — piloto

Módulo exclusivo para empresas y operadores registrados del Aeropuerto Internacional Mariscal Sucre de Quito.

## Flujos incluidos
- OFREZCO / NECESITO con material, cantidad, estado y modalidad.
- Revisión EHS de publicaciones, con rechazo de materiales marcados como regulados.
- Coincidencias por nombre exacto del material (sugerencias, no autorizaciones).
- Solicitudes entre empresas distintas y aprobación EHS.
- Estados de publicación y solicitud.

## Limitaciones críticas
**Piloto local, no apto para producción.** La persistencia utiliza localStorage del navegador, no una base de datos compartida. El repositorio actual usa una autenticación local provisional que no verifica contraseñas. Los roles de la interfaz NO constituyen controles de acceso seguros. No cargar información sensible ni ejecutar transferencias reales con este módulo.

Antes de uso institucional:
1. Integrar Supabase Auth y asignación de roles verificada en servidor.
2. Crear tablas y políticas RLS por empresa, aprobador EHS y gestor autorizado.
3. Añadir auditoría inmutable de decisiones, evidencias de entrega y cierre de transferencia.
4. Validar clasificación legal, propiedad del material, autorización y condiciones de transferencia.
5. Definir inventario de operadores elegibles y pruebas automatizadas de permisos.
6. Integrar avisos y validación de solicitudes concurrentes.

No se admite transferencia libre de residuos peligrosos o sanitarios. La aprobación de una solicitud en el piloto no es autorización ambiental.
