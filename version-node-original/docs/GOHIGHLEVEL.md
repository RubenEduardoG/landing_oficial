# Integración futura con GoHighLevel

GHL, Google Calendar y Google Meet no están conectados en esta revisión. Se conserva el backend Node.js, Supabase y el webhook opcional para probar localmente y completar la integración sin perder registros.

## Recorrido implementado

1. Landing pública, sin registro ni redirección automática.
2. Agenda primero en la página de registro.
3. Datos personales y seis preguntas, después de la reserva, en esa misma página.
4. Resultado “Gracias” o “No apto”; una calificación negativa no cancela la reserva.

Los PDF colocan el formulario bajo el VSL y califican antes de reservar. La instrucción posterior del cliente prevalece para esta revisión: agenda primero, seguida de los datos y preguntas. Solo queda un enlace discreto “Continuar al registro” en la landing.

## Agenda GHL

`GHL_CALENDAR_URL` acepta un enlace HTTPS al calendario/embed de GHL. Si está configurado, el frontend presenta el calendario y un estado que explica que la confirmación aún no está conectada al backend. Un clic o evento del iframe nunca se interpreta como reserva confirmada y no habilita las preguntas. Sin URL se muestra agenda pendiente (en desarrollo local sin configurar GHL se habilitan horarios demo).

Para producción falta implementar y verificar el mecanismo autorizado de confirmación de reservas de GHL antes de guardar booking y abrir las preguntas. No se conecta Calendly. Google Calendar y Meet deben configurarse desde la agenda/workflow de GHL; esta versión no crea reuniones ni mensajes.

## Pipeline y mensajes por configurar

Los nombres de etapa y reglas confirmadas para esta tarea son:

| Etapa | Entrada / comportamiento que debe configurarse |
| --- | --- |
| Reunión agendada | Solo tras confirmar una reserva real de GHL. Enviar el regalo principal al confirmarla, sin esperar 10 minutos. El regalo y su enlace siguen pendientes; no sustituirlos. |
| Recordatorios | Enviar recordatorios automáticos 10 horas y 2 horas antes de la cita. El recordatorio de 5 minutos lo envía Marisol manualmente. Al cancelarse una cita, detener todos sus recordatorios pendientes. |
| En proceso de cierre | Etapa del pipeline; falta confirmar el disparador y el mensaje correspondiente. |
| Canceló — reagendamiento | Usar cuando se cancela la cita y se da seguimiento al reagendamiento. Detener los recordatorios de la cita cancelada; no tratarlos como recordatorios de una nueva cita. |
| Seguimiento — no asistió | Iniciar solo si la persona no asiste. Detener la secuencia en cuanto responda o reagende. El PDF `Empresas que llegan a Yucatán.pdf` corresponde al mensaje S3 de este seguimiento, no al regalo principal. |
| Invirtió | Etapa para registrar una inversión confirmada; faltan por definir el evento de entrada y las acciones posteriores. |
| Lead perdido | Etapa para leads perdidos; falta definir el criterio de entrada y las acciones posteriores. |

La indicación final del cliente reemplaza el retraso de 10 minutos que, según su instrucción, aparece en el PDF: el regalo debe enviarse al confirmar una reserva real. “Real” requiere la confirmación verificable de GHL; horarios de prueba local, clics en el embed y reservas no verificadas no deben disparar mensajes.

El cliente especificó que la persona se llama **Francelia**. Los recordatorios de 10 y 2 horas y el envío manual de 5 minutos son las únicas cadencias confirmadas aquí. Los textos literales y los tiempos del resto de los mensajes no se transcriben: los dos PDF indicados no estaban disponibles en el workspace al preparar esta revisión. No redactar ni activar mensajes con texto o esperas inventados; incorporarlos tras recibir y revisar los archivos completos. El PDF de empresas tampoco estaba disponible para extraer su contenido.

## Campos a mapear

| Campo | Valores |
| --- | --- |
| `name`, `whatsapp`, `email` | Datos obligatorios de contacto |
| `experience` | `experienced`, `first-time` |
| `goal` | `income`, `family`, `diversify`, `bank` |
| `timeline` | `30days`, `2-3months`, `evaluating` |
| `capital` | `under-250k`, `250-500k`, `over-500k` |
| `monthly` | `under-5k`, `5-10k`, `over-10k` |
| `decision` | `solo`, `partner`, `family` |
| `qualified` | Resultado de los tres filtros indicados abajo |
| `bookingId` | Identificador interno de reserva |

El formulario ofrece el enlace existente “Privacy Policy” a `/privacidad`; no agrega campos ni preguntas adicionales.

## Calificación

Solo se marca “No apto” si la persona elige:

- “Todavía lo estoy evaluando” (`timeline: evaluating`).
- “Menos de $250,000 MXN” (`capital: under-250k`).
- “Menos de $5,000” al mes (`monthly: under-5k`).

No hay filtros por experiencia, objetivo o quién decide. Estos son los filtros especificados para esta revisión; confirmar que coincidan con la configuración del formulario original de GHL antes de activarlos en producción.

## Datos y pendientes

- URL HTTPS real del calendario y permisos de embed.
- Confirmación webhook/callback verificable y su firma/autenticación.
- Subcuenta, calendario, conexión de Google Calendar/Meet y pruebas de confirmación.
- Campos personalizados, pipeline, automatizaciones y mensajes aprobados.
- URL real del webhook de leads, solo después de probar el mapeo y la autorización.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y esquema ejecutado para persistencia productiva.

El preview `/registro?preview=1` no llama APIs, no reserva, no guarda respuestas y no envía datos. El modo demo sí persiste datos de prueba locales en JSONL, pero no llama servicios externos.
