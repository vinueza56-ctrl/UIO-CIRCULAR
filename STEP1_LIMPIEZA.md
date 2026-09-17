# Paso 1 - Limpieza de datos de demostración

Cambios realizados:
- Eliminados todos los datos precargados de empresas, usuarios, residuos, pesajes, actas, auditoría y notificaciones.
- Eliminado el generador de fotografías simuladas de balanza.
- Eliminados los accesos rápidos y cambio de rol de demostración.
- Eliminada la opción de restablecer datos de demostración.
- Eliminados botones de pesos rápidos.
- Eliminados nombres ficticios incrustados en actas y visor de fotografías.
- Las áreas/ubicaciones de empresas ahora se ingresan libremente y no dependen de una lista precargada.
- Se añadió una limpieza única para borrar del navegador datos sembrados por versiones anteriores del prototipo.

Estado intencional tras Paso 1:
- El sistema inicia sin usuarios ni información operativa.
- La autenticación local existente todavía NO es apta para producción; será sustituida por Supabase Auth en el Paso 2.
- La persistencia todavía usa localStorage; será sustituida por PostgreSQL/Supabase en pasos posteriores.
- Las fotografías todavía se manejan localmente; luego se migrarán a Supabase Storage privado.
