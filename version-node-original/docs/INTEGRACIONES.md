# Integraciones y variables

## Configuración

El backend local sirve frontend y API desde el mismo origen. En Vercel los archivos estáticos se sirven desde `frontend/` y `/api/*` se ejecuta en Node.

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto local; predeterminado `5173` |
| `HOST` | Interfaz local; predeterminada `127.0.0.1` |
| `PUBLIC_ORIGIN` | Origen permitido; local `http://localhost:5173`, producción HTTPS |
| `NODE_ENV` | En producción deshabilita agenda y persistencia demo |
| `DEMO_BOOKING` | Agenda de prueba solo fuera de producción y en origen local |
| `DATA_DIR` | Carpeta JSONL local, fuera de la carpeta pública |
| `LEAD_RATE_LIMIT` | Límite de envíos |
| `GHL_CALENDAR_URL` | URL HTTPS opcional del embed de la agenda GHL |
| `GHL_LEAD_WEBHOOK_URL` | Webhook HTTPS opcional para leads |
| `GHL_WEBHOOK_TOKEN` | Token del webhook, solo en backend |
| `SUPABASE_URL` | Obligatoria en producción para persistencia |
| `SUPABASE_SERVICE_ROLE_KEY` | Obligatoria en producción, solo en backend |

El embed no confirma una reserva al servidor. La confirmación verificada de GHL y su enlace de webhook/callback son trabajo pendiente. Sin URL de calendario, producción muestra agenda pendiente. El calendario debe conectarse en GHL a Google Calendar y Google Meet; no se usa Calendly.

## Modo local y preview

La vista previa `http://localhost:5173/registro?preview=1` no consulta las API, no reserva y no guarda ni envía respuestas. El modo demo de desarrollo permite recorrer el backend y agrega reservas/respuestas de prueba a los archivos JSONL locales; no crea reuniones ni envía mensajes.

Ejecuta [`../supabase/schema.sql`](../supabase/schema.sql) en el SQL Editor de Supabase. El esquema habilita RLS sin políticas públicas; el servidor usa `service_role`. No agregues esa clave al frontend. En producción las reservas, respuestas, sesiones (token hasheado) y límites usan Supabase. Sin almacenamiento configurado la API bloquea escrituras explícitamente.

La web guarda antes de invocar el webhook opcional de GHL. `deliveries` registra `not-configured`, `failed` o `delivered`. Una falla de webhook no elimina el lead; no hay reintentos ni mensajes automáticos incorporados.

## Reglas de resultado

“No apto” aplica exclusivamente a `timeline: evaluating`, `capital: under-250k` o `monthly: under-5k`. No se filtra por experiencia, objetivo ni decisión. La reserva se conserva aunque el resultado sea negativo.

## Vercel

- Framework Preset: `Other`; Root Directory: raíz.
- Build Command: `npm run build`; Output Directory: `frontend`.
- Runtime: Node `24.x`.
- Obligatorio: `PUBLIC_ORIGIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Opcional: `GHL_CALENDAR_URL`, `GHL_LEAD_WEBHOOK_URL`, `GHL_WEBHOOK_TOKEN`, `LEAD_RATE_LIMIT`.

Lee [`GOHIGHLEVEL.md`](./GOHIGHLEVEL.md) para la agenda y el mapeo pendientes.
