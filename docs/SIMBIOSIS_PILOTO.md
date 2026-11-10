# Simbiosis empresarial — piloto de interfaz

Módulo restringido en la navegación a perfiles `empresa` y `admin`, con catálogo OFREZCO/NECESITO, coincidencias por material, solicitudes y revisión EHS.

## Limitaciones de seguridad (bloqueantes para producción)
El repositorio existente usa autenticación local temporal: `useAuth` no valida contraseñas, y los perfiles se obtienen del almacenamiento del navegador. Este módulo guarda oportunidades y solicitudes en `localStorage` y aplica permisos solo en la interfaz. **No hay aislamiento real entre empresas, persistencia compartida, RLS ni auditoría confiable.** No utilizar para datos reales ni autorizar transferencias.

## Requisitos para habilitación institucional
1. Supabase Auth con identidades verificadas y asociación de cada usuario a una empresa activa y autorizada del aeropuerto.
2. Tablas `symbiosis_listings`, `symbiosis_requests` y `symbiosis_audit` con RLS y políticas basadas en claims/identidad del servidor; no confiar en IDs enviados por el cliente.
3. Validación de material no peligroso y no regulado del lado servidor; materiales sujetos a control se derivan a gestión ambiental autorizada.
4. EHS aprueba publicación y solicitud antes de cualquier intercambio; registrar entrega real, fecha, cantidad y evidencia separadamente.
5. Notificaciones y almacenamiento seguro de imágenes; control de tamaño, tipo y acceso.
6. Pruebas de aislamiento entre empresas, transiciones de estado, auditoría y concurrencia.

El presente PR se mantiene como **borrador**, no como funcionalidad lista para producción.
