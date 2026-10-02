# Integraciones y variables

## Configuración local

El backend local sirve el frontend y las API desde el mismo origen. En Vercel los archivos del frontend se sirven estáticamente desde `frontend/` y las rutas `/api/*` se ejecutan como una función Node.

| Variable | Uso / valor por defecto |
| --- | --- |
| PORT | 5173 |
| HOST | 127.0.0.1; 0.0.0.0 detrás de un proxy configurado |
| PUBLIC_ORIGIN | http://localhost:5173; en producción, URL HTTPS exacta del sitio |
| NODE_ENV | development implícito; production deshabilita la demo |
| DEMO_BOOKING | La demo funciona solo con origen local y fuera de producción; false la desactiva |
| DATA_DIR | Solo local; carpeta JSONL de desarrollo (no se usa en producción) |
| LEAD_RATE_LIMIT | 30 envíos/minuto por IP en local; 10 fuera de local; rango 1–100 |
| CALENDLY_URL | https://calendly.com/rubengutierrezdv/new-meeting por defecto; vacío habilita demo local |
| CALENDLY_API_TOKEN | Token privado de la cuenta de Calendly, con permiso para leer eventos e invitados |
| CALENDLY_EVENT_TYPE_URI | URI del tipo de evento, https://api.calendly.com/event_types/UUID |
| GHL_LEAD_WEBHOOK_URL | Webhook HTTPS opcional que recibe datos al finalizar las preguntas |
| GHL_WEBHOOK_TOKEN | Bearer token opcional para ese webhook |
| RESOURCES_URL | URL HTTPS opcional para la página de no apto |
| SUPABASE_URL | URL HTTPS del proyecto Supabase; obligatoria en producción |
| SUPABASE_SERVICE_ROLE_KEY | Clave privada `service_role`; obligatoria en producción y solo se usa en backend |

Ejecuta [`../supabase/schema.sql`](../supabase/schema.sql) en SQL Editor de Supabase. El esquema habilita RLS sin políticas públicas; la función de servidor accede con `service_role`. No agregues esta clave a archivos públicos ni a variables `VITE_*`/frontend. En producción las reservas, respuestas, sesiones (token hasheado) y límites de solicitudes usan Supabase, no el sistema de archivos o un mapa de memoria. Sin configuración, la API de reserva devuelve un error 503 y el frontend indica que no se guardaron datos.

## Calendly real

El enlace enviado ya está incorporado y funciona como widget sin token API. Después de `calendly.event_scheduled`, se guardan las referencias del evento e invitado, marcadas `verification: browser-event-only`. El frontend valida origen y ventana del iframe. Este modo no es una verificación independiente de reserva en el servidor y no valida duración ni ventana de disponibilidad: configúralas en Calendly. La página de gracias remite al email de Calendly y no genera un Google Calendar con fechas desconocidas.

El modo con API descrito a continuación es opcional y ofrece verificación adicional del lado del servidor. El almacenamiento Supabase, en cambio, sí es obligatorio en Vercel.

1. Crear o seleccionar el evento con Marisol de **45 minutos**.
2. Conectar Google Calendar/Meet y las notificaciones de confirmación de Calendly.
3. Limitar la ventana de reservas a **2 días**, revisar zona horaria y horas de disponibilidad. El frontend demo muestra Ciudad de México; el embed real sigue la zona seleccionada en Calendly.
4. Obtener la URL pública, el token API y la URI del tipo de evento de esa misma cuenta. La URL ya está incluida. Rellenar token y URI en `.env` si deseas activar la verificación del servidor.
5. Reiniciar Node y revisar una reserva real de prueba con autorización de la cuenta. No se realizaron reservas reales al preparar este ZIP.

Cuando configuras token y URI, el widget oficial emite `calendly.event_scheduled` y el backend consulta el invitado y el evento con el token privado, comprueba que estén activos, que correspondan al tipo de evento configurado y que duren 45 minutos dentro de las próximas 48 horas. Solo después habilita las preguntas. Una notificación del navegador por sí sola no confirma la reserva.

Si la validación falla, se muestra un error y no se habilitan las preguntas; una reserva externa creada previamente puede seguir existiendo. Corregir la disponibilidad del evento en Calendly, porque el backend no puede impedir que el widget ofrezca horarios mal configurados.

En modo API, la página de gracias utiliza fecha/hora reales verificadas para el enlace Google Calendar y agrega la URL de Meet cuando Calendly la devuelve. La entrega del email depende de las notificaciones configuradas en Calendly. El regalo por WhatsApp requiere seguimiento de Marisol o una automatización propia; el código no envía WhatsApp.

Documentación oficial consultada:

- https://calendly.com/help/advanced-calendly-embed-for-developers
- https://developer.calendly.com/api-docs/calendly-api/scheduled-events/get-event-invitee
- https://developer.calendly.com/api-docs/calendly-api/scheduled-events/get-scheduled-event

## GHL

El audio indica Calendly, por eso el formulario de preguntas es nativo y la agenda es Calendly. No se inserta un iframe GHL sin el código del cliente. Puede conectarse GHL mediante `GHL_LEAD_WEBHOOK_URL` y `GHL_WEBHOOK_TOKEN`.

El lead se persiste antes de enviar al webhook, incluyendo su estado de calificación y la reserva. `deliveries` (o `backend/data/deliveries.jsonl` local) registra si se entregó, falló o no estaba configurado. Un fallo de GHL no elimina el registro del lead. No hay reintentos automáticos ni envío de campañas: las entregas fallidas deben procesarse con una automatización posterior. El endpoint tiene un timeout de ocho segundos y rechaza redirecciones.

## Datos

- Local: `backend/data/bookings.jsonl`, `leads.jsonl` y `deliveries.jsonl`.
- Producción: tablas `bookings`, `leads`, `sessions`, `deliveries` y `rate_limits` de Supabase.

No existen endpoints públicos para descargar estos datos. El identificador de sesión sin procesar solo está en la cookie HttpOnly; Supabase conserva su hash. Los registros de datos personales se deben consultar con acceso administrativo autorizado. La tabla `sessions` puede limpiarse periódicamente con `delete from public.sessions where expires_at < now();` en SQL Editor. No se cancela una reserva real de Calendly al marcar un lead como no apto.

## Vercel

- Framework Preset: `Other`.
- Root Directory: `./` (raíz del repositorio).
- Build Command: `npm run build`.
- Output Directory: `frontend`.
- Runtime de funciones: Node `24.x`, fijado en `package.json`.
- El fallback estático sirve el `index.html` para las rutas del recorrido; Vercel sirve los medios estáticos directamente y la función `api/[...path].mjs` atiende las API.

Variables obligatorias de producción: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `PUBLIC_ORIGIN`. Variables opcionales: `CALENDLY_API_TOKEN`, `CALENDLY_EVENT_TYPE_URI`, `GHL_LEAD_WEBHOOK_URL`, `GHL_WEBHOOK_TOKEN`, `RESOURCES_URL` y `LEAD_RATE_LIMIT`. La URL de Calendly está preconfigurada y puede repetirse en `CALENDLY_URL`.
