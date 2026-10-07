# Verificación de la revisión local

Ejecuta `npm run check` y `npm test` antes de publicar. Las pruebas automatizadas cubren:

- Orden agenda → preguntas y persistencia local de los campos definitivos.
- Los tres filtros exactos de “No apto” y rechazo de campos/opciones inválidos.
- Bloqueo de reservas sin booking de agenda confirmado y punto configurable HTTPS de GHL.
- Persistencia de la calificación en Supabase simulada, sin simular una reserva real.
- Rutas públicas, privacidad de archivos, límites de tamaño y disponibilidad demo.

La vista previa `http://localhost:5173/registro?preview=1` no solicita `/api/config`, `/api/session`, `/api/bookings` ni `/api/qualification`; la validación ocurre solo en el navegador y no hay escrituras ni envíos.

Al comprobar la interfaz:

- Desktop: Rogel y Ana Karen en dos tarjetas compactas lado a lado; Francelia y Paul conservan sus relatos.
- Móvil: tarjetas apiladas y sin overflow horizontal; formulario apilado.
- Revisar videos testimoniales reales. El VSL principal `frontend/assets/videos/vsl.mp4` no está disponible; el video de instrucciones no lo reemplaza.
- Confirmar las tres reglas de calificación con el formulario original de GHL antes de producción.

No se conectaron GHL, Google Calendar ni Google Meet, y no se enviaron mensajes. El embed de GHL no desbloquea preguntas: se requiere una confirmación de reserva comprobable del backend. La reserva de prueba local sí se guarda en JSONL, pero no agenda una sesión real.
