# Pendientes para activar BOSCO

## Materiales y contenido

- VSL principal final en `frontend/assets/videos/vsl.mp4`. No usar el video de instrucciones como reemplazo.
- Responsable legal, domicilio/canal de privacidad y textos legales definitivos.
- Contrato y permisos con contenido sensible difuminado, solo si el cliente decide reemplazar las ilustraciones existentes.
- Revisar los textos comerciales con el cliente y su documentación; este trabajo conserva las correcciones aportadas y no certifica cifras o afirmaciones legales.

## GoHighLevel, Google Calendar y Meet

- Subcuenta, permisos y URL HTTPS real de agenda GHL; configurar `GHL_CALENDAR_URL`.
- Configurar el calendario de GHL con Google Calendar y Meet.
- Implementar un webhook/callback autorizado y verificable para confirmar una reserva. Hasta entonces el embed no habilita datos/preguntas ni se guardan reservas productivas; no interpretar clics/eventos no verificados como confirmación.
- Confirmar si el formulario original de GHL usa exactamente los tres filtros de calificación establecidos en esta revisión.
- Configurar las etapas y reglas de mensajes pendientes descritas en `GOHIGHLEVEL.md`; recibir y revisar completos `Pipeline_Mensajes_GHL.pdf` y `Empresas que llegan a Yucatán.pdf` para transcribir los textos y tiempos todavía no verificables.
- Obtener el regalo principal aprobado y su enlace. Enviar ese regalo al confirmarse una reserva real, sin el retraso de 10 minutos indicado en el PDF; el PDF de empresas es el mensaje S3 del seguimiento, no el regalo.
- Configurar los recordatorios automáticos 10 horas y 2 horas antes, el aviso manual de 5 minutos por Marisol, detener recordatorios de una cita cancelada y detener el seguimiento de inasistencia cuando la persona responda o reagende.
- Aprobar campos, pipeline, automatizaciones y mensajes; configurar `GHL_LEAD_WEBHOOK_URL` y opcionalmente `GHL_WEBHOOK_TOKEN` solo después de probar el mapeo.
- Verificar que un resultado “No apto” conserva la reserva (la cancelación automática no está definida).

Los dos PDF de seguimiento mencionados no están presentes en `referencias-cliente/Mensajes de Seguimiento/` ni en el workspace revisado. Por eso no se pudieron leer ni verificar sus textos o tiempos, y no se afirma haberlos revisado. Esta documentación refleja únicamente las reglas detalladas explícitamente en la solicitud; completar los detalles del PDF requiere recibir los archivos.

La agenda definitiva será de GHL. Los horarios locales de prueba no son reservas reales. Esta revisión no afirma que GHL, Google Calendar, Meet, WhatsApp ni las automatizaciones estén conectados.

## Producción

Vercel requiere `PUBLIC_ORIGIN`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, además de ejecutar `supabase/schema.sql`. La migración a GHL debe preservar los registros existentes: no se deben eliminar ni sobrescribir los JSONL o datos de Supabase durante la puesta en marcha.
