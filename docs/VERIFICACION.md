# Verificación de despliegue

Validado en local con Node 24.x:

- `npm run check` y `npm run build`.
- `npm test`: 15 pruebas backend.
- Todas las rutas públicas y páginas directas (`/`, `/registro`, `/gracias`, `/no-apto`, `/privacidad`, `/terminos`), seguridad de archivos y streaming de video por HEAD/rangos.
- Flujo agenda → preguntas, validaciones, filtros de calificación, cookie de sesión, Calendly verificado y modo embed no verificado.
- Persistencia local JSONL en desarrollo; persistencia de reservas, respuestas y sesión por Supabase simulada en producción; caso sin variables Supabase informa error y no escribe archivos.
- La configuración del frontend incluye `/api/config`, `/api/session`, `/api/bookings`, `/api/qualification` y `/api/slots` para demo local.
- `vercel.json` usa `frontend` como Output Directory y las rutas de página se reescriben a `index.html`.

Los tests de Supabase usan una respuesta HTTP simulada: no se conectó a un proyecto real ni se ejecutó el esquema contra una base remota. No se publicó un despliegue real en Vercel, no se hizo una reserva real de Calendly y no se probaron credenciales, entrega de correo o WhatsApp. La reproducción y los rangos se comprobaron con el servidor local; no se hizo una prueba real de navegador/iPhone en Vercel.

El VSL principal (`/assets/videos/vsl.mp4`) y la fuente Inter (`/assets/fuentes/inter-var.woff2`) siguen pendientes de entrega. Los MP4 activos, sus posters y las imágenes verificadas conservan rutas relativas desde el directorio estático.

## Revisión tras configurar

1. En Supabase, ejecutar `supabase/schema.sql` y configurar en Vercel `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `PUBLIC_ORIGIN`.
2. Revisar en `/api/config` que `storageReady` sea `true`; probar acceso a las páginas directas.
3. Completar el recorrido con Calendly y comprobar el registro en Supabase. Para verificar la cita desde servidor, habilitar token API y URI del tipo de evento.
4. Probar los MP4, la barra de avance del VSL y los poster/imágenes bajo el dominio desplegado.
