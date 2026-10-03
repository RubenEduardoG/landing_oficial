# Lo que falta para terminar y activar el proyecto

El código, las fotos entregadas, los cuatro videos testimoniales y el caso fotográfico Daniela están incluidos. El Calendly entregado se conserva. El video de Aaron se revisó visualmente como referencia; no es un material para insertar como presentación comercial y no se verificó una transcripción de su audio.

## Materiales del cliente

1. VSL principal final, en MP4. Destino: frontend/assets/videos/vsl.mp4.
2. Si desea imágenes de documentos reales en lugar de ilustraciones: contrato y permisos con contenido sensible ya oculto. No son necesarios para ejecutar esta versión.
3. Responsable legal, domicilio/canal de privacidad y textos legales definitivos.
4. Enlace real de recursos para la pantalla de no apto.

## GoHighLevel

Se necesita la subcuenta destino y la configuración del workflow. La web NO tiene una URL de webhook del cliente ni acceso a su cuenta.

Con la web actual en Vercel, el código puede enviar `{lead, booking}` a un workflow de GHL. La URL de recepción se guarda como GHL_LEAD_WEBHOOK_URL en Vercel, nunca en el frontend. El workflow debe crear/actualizar el contacto y mapear sus campos. El token GHL_WEBHOOK_TOKEN es opcional y solo aplica si el destino realmente requiere Bearer; no reemplaza la configuración del workflow.

Mapeo previsto:

| Payload del backend | Campo en GHL |
| --- | --- |
| lead.name | Nombre del contacto |
| lead.email | Email |
| lead.whatsapp | Teléfono / WhatsApp |
| lead.experience | Campo personalizado: experiencia |
| lead.goal | Campo personalizado: objetivo |
| lead.timeline | Campo personalizado: plazo |
| lead.capital | Campo personalizado: capital |
| lead.monthly | Campo personalizado: mensualidad |
| lead.decision | Campo personalizado: decisión |
| lead.consent | Consentimiento de esta solicitud |
| lead.qualified | Resultado de calificación |
| lead.bookingId | Identificador de reserva |
| booking.invitee / booking.event | Referencias de Calendly, si están disponibles |
| booking.start / booking.end / booking.meetUrl | Solo existen con verificación API; no inventar en modo embed |

Esta propuesta no crea etapas o campañas nuevas sin aprobación. Pedir al cliente el pipeline/etapas y los mensajes y tiempos de seguimiento aprobados. No se envían mensajes automáticamente por tener el ZIP.

Guía oficial: https://help.gohighlevel.com/support/solutions/articles/48001237383
Configurar trigger Inbound Webhook, seleccionar muestra JSON y acción Create/Update Contact. Mapear email o teléfono y campos adicionales. La disponibilidad de este trigger depende de su configuración en la cuenta.

Si la web se traslada por completo al editor de GHL, debe reemplazarse la lógica /api por componentes/workflows nativos o conservar el backend externo. Este ZIP no se importa como funnel nativo de GHL.

## Agenda

Se conserva https://calendly.com/rubengutierrezdv/new-meeting.
Confirmar que pertenece a Marisol/el cliente y está conectado al calendario correcto. La duración de 45 minutos y ventana de 48 horas proceden del maquetado BOSCO. La URL del desarrollador se mantiene porque fue la que proporcionó el usuario; no prueba titularidad ni disponibilidad.

Para verificar reservas en el servidor: configurar CALENDLY_API_TOKEN y CALENDLY_EVENT_TYPE_URI de la cuenta correcta, privados. Sin esos valores se guarda la referencia del evento del navegador y se remite a la confirmación real de Calendly.

## Mientras se publique en Vercel

La persistencia ya implementada necesita SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel y ejecutar supabase/schema.sql. No se entregan valores falsos. PUBLIC_ORIGIN debe coincidir con el dominio publicado. Si se pasa por completo a GHL, evaluar el retiro de esta persistencia al sustituir su función, no antes.

Compartir capturas del workflow o datos de configuración no secretos permite revisar el mapeo. Las claves y tokens se cargan directamente en las variables del servicio; no enviarlos por chat.
