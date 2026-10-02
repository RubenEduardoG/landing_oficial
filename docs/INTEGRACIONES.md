# Integraciones y variables

## Configuración local

El backend sirve el frontend y las API desde el mismo origen. No hay segundo servidor ni comando independiente para el frontend. El navegador utiliza rutas relativas, por lo que fotos, videos y API funcionan también bajo un dominio.

| Variable | Uso / valor por defecto |
| --- | --- |
| PORT | 5173 |
| HOST | 127.0.0.1; 0.0.0.0 detrás de un proxy configurado |
| PUBLIC_ORIGIN | http://localhost:5173; en producción, URL HTTPS exacta del sitio |
| NODE_ENV | development implícito; production deshabilita la demo |
| DEMO_BOOKING | La demo funciona solo con origen local y fuera de producción; false la desactiva |
| DATA_DIR | backend/data dentro del proyecto; puede apuntar a un directorio persistente privado |
| LEAD_RATE_LIMIT | 30 envíos/minuto por IP en local; 10 fuera de local; rango 1–100 |
| CALENDLY_URL | https://calendly.com/rubengutierrezdv/new-meeting por defecto; vacío habilita demo local |
| CALENDLY_API_TOKEN | Token privado de la cuenta de Calendly, con permiso para leer eventos e invitados |
| CALENDLY_EVENT_TYPE_URI | URI del tipo de evento, https://api.calendly.com/event_types/UUID |
| GHL_LEAD_WEBHOOK_URL | Webhook HTTPS opcional que recibe datos al finalizar las preguntas |
| GHL_WEBHOOK_TOKEN | Bearer token opcional para ese webhook |
| RESOURCES_URL | URL HTTPS opcional para la página de no apto |

## Calendly real

El enlace enviado ya está incorporado y funciona como widget sin token API. Después de `calendly.event_scheduled`, se guardan las referencias del evento e invitado, marcadas `verification: browser-event-only`. El frontend valida origen y ventana del iframe. Este modo no es una verificación independiente de reserva en el servidor y no valida duración ni ventana de disponibilidad: configúralas en Calendly. La página de gracias remite al email de Calendly y no genera un Google Calendar con fechas desconocidas.

El modo con API descrito a continuación es opcional y ofrece verificación adicional.

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

Se guarda el lead local antes de enviar al webhook, incluyendo su estado de calificación y la reserva. `backend/data/deliveries.jsonl` registra si se entregó, falló o no estaba configurado. Un fallo de GHL no pierde el registro local. No hay reintentos automáticos ni envío de campañas: los registros fallidos deben procesarse con una automatización posterior. El endpoint tiene un timeout de ocho segundos y rechaza redirecciones.

## Datos

- `bookings.jsonl`: reservas de prueba o verificadas.
- `leads.jsonl`: respuestas, consentimiento, calificación y referencia de reserva.
- `deliveries.jsonl`: estado de entrega a GHL.

No existen endpoints públicos para descargar estos archivos. Copiar/restaurar registros y revisar leads se hace en el servidor. Borrar `bookings.jsonl` reinicia únicamente la disponibilidad de demostración; no borra ni cancela reservas de Calendly.
