# Auditoría técnica y UX — CIRCULA UIO (10 noviembre 2026)

## Alcance
Revisión estática de App, NavBar, autenticación local, servicio de datos, pantalla de acceso, servidor OCR y módulo de simbiosis en la rama feature/simbiosis-empresarial-uio. No se ejecutaron build, tests E2E ni pruebas de penetración.

## Hallazgos
| Severidad | Hallazgo | Acción |
|---|---|---|
| CRÍTICA | useAuth.login ignora la contraseña y acepta un email activo; los roles proceden de localStorage manipulable | Bloquear producción; migrar a Supabase Auth y RLS, verificar roles del lado servidor |
| CRÍTICA | Registros de simbiosis, solicitudes y aprobaciones solo en localStorage, no compartidos ni auditables | Persistencia transaccional, controles RLS, historial inmutable y eventos de aprobación |
| ALTA | Se detectaron importación duplicada de SimbiosisView, render duplicado y Handshake duplicado | Corregido en esta rama |
| ALTA | Acceso visual del gestor a una ruta no autorizada | Corregido en esta rama |
| ALTA | Aprobación de solicitud podía ocurrir aun si la publicación ya no estaba disponible | Agregada validación de estado y de materiales regulados en el piloto; replicar obligatoriamente en servidor |
| ALTA | Cálculos de CO₂ evitado y árboles equivalentes con factores fijos no documentados en EmpresaDashboard | Retirar de producción hasta metodología aprobada, incertidumbre y trazabilidad de factores |
| MEDIA | Coincidencias basadas solo en nombre de material | Añadida condición de unidades iguales y empresas distintas; falta taxonomía, compatibilidad, localización y cantidad |
| MEDIA | Catálogo sin filtros ni mensajes de búsqueda útiles | Agregados filtros por tipo/estado, limpieza y contador |
| MEDIA | No existe evidencia de entrega física, conformidad de ambas partes ni cierre de transferencia | Diseñar flujo de reserva, entrega, acta, cantidades reales y confirmación bilateral |
| MEDIA | No hay programación de rutas de tóneres y aceites usados | Desarrollar módulo independiente de jornadas EHS y adhesión de operadores; validar clasificación y gestores autorizados |
| MEDIA | API OCR acepta imágenes grandes y carece de autenticación y limitación de solicitudes | Limitar tamaño, tipos MIME, frecuencia y autenticación; validar respuestas del modelo |

## Pruebas de aceptación pendientes
- Empresa A no puede leer borradores de empresa B ni aprobar solicitudes.
- Gestor no puede entrar a simbiosis por manipulación de ruta.
- No se pueden solicitar bienes propios ni duplicar solicitudes activas.
- Una publicación cerrada o regulada no admite nuevas solicitudes ni aprobaciones.
- EHS puede revisar y dejar razón documentada de cada decisión.
- La cantidad transferida se valida y no supera la disponible.
- Las modificaciones concurrentes no duplican inventario.
- Accesibilidad: navegación con teclado, etiquetas, foco visible, contraste y lector de pantalla.
- Verificación de build, TypeScript, tests unitarios y E2E en CI.

## Prioridad recomendada
1. Autenticación real, base de datos y políticas RLS.
2. Flujo completo de transferencia con evidencia y trazabilidad.
3. Rutas de recolección programada para tóneres y aceites, separadas del marketplace.
4. Notificaciones, fotografías, filtros avanzados y tablero de seguimiento.
5. Indicadores de circularidad con metodologías aprobadas.

**Decisión:** no fusionar ni publicar como aplicación institucional hasta resolver los hallazgos críticos.
