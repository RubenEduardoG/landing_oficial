# Configuración futura en GoHighLevel

Este ZIP completa el maquetado solicitado sobre el proyecto actual. No accede a la cuenta de GHL ni activa workflows, envío de mensajes o registros externos.

## Recorrido a reproducir

1. Landing pública con VSL, cuatro videos testimoniales y contenido aprobado.
2. Agenda directa en segunda página; conservar Calendly hasta acordar calendario GHL.
3. Después de la cita, preguntas de calificación en esa misma página.
4. Gracias/no apto según las respuestas aprobadas. No cancelar automáticamente la cita.

Campos a mapear: nombre, email, WhatsApp, experiencia, objetivo, plazo, capital, mensualidad, decisión, consentimiento, resultado de calificación e identificadores de reserva. Los enum y filtros se conservan en frontend/app.js y backend/server.mjs.

El webhook existente `GHL_LEAD_WEBHOOK_URL` recibe `{lead, booking}` después de guardar las respuestas. Su URL y token son privados y se configuran en backend. No está conectado por incluir el ZIP. Crear y probar en la cuenta destino el workflow que interprete esos campos, actualice el contacto y aplique las etapas acordadas. No activar mensajes de prueba sobre contactos reales.

La lógica actual requiere Node para /api. Para alojar el funnel enteramente en GHL hay que reconstruir los bloques visuales con su editor/código admitido y sustituir las llamadas /api por formularios, calendario y workflows configurados en esa cuenta, o conservar este backend externo. No pegar app.js directamente esperando que las rutas API funcionen dentro de GHL.

Decisiones necesarias: cuenta/subcuenta del cliente, dominio, calendario definitivo, remitente de email/WhatsApp, textos de mensajes y reglas de seguimiento aprobados, campos y etapas del pipeline, documentación de privacidad. Configurar únicamente lo aprobado y probar un contacto de prueba identificado.
