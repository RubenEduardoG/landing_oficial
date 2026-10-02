# BOSCO Departamentos · Marisol Caro

Proyecto completo: frontend HTML/CSS/JavaScript y backend Node.js, con los medios reales entregados por el cliente. Versión 5.2, octubre de 2026.

## Arranque en un solo comando

Necesitas **Node.js 24.x** instalado. El runtime de Node se instala en tu equipo; no se distribuye un ejecutable específico de un sistema operativo dentro de este ZIP.

1. Extrae el ZIP.
2. Abre la terminal dentro de `bosco-completo`, donde está `package.json`.
3. Instala dependencias y ejecuta:

```sh
npm install
npm run dev
```

Abre **http://localhost:5173**. No necesitas copiar `.env` para la prueba local; la agenda demo y los JSONL locales funcionan automáticamente. `Ctrl+C` detiene el servidor.

Si usas nvm, primero ejecuta `nvm use`. `.nvmrc` y `.node-version` fijan Node 24. Si el puerto está ocupado, configura otro `PORT` y el mismo puerto en `PUBLIC_ORIGIN` dentro de `.env`.

## Qué recibes

- Landing pública sin gate, con la promesa, secciones y paleta nuevas.
- Página `/registro`: agenda, seguida de las nueve preguntas de calificación.
- `/gracias`, `/no-apto`, `/privacidad` y `/terminos`.
- Tu Calendly real integrado por defecto: https://calendly.com/rubengutierrezdv/new-meeting.
- Agenda local de demostración opcional, al vaciar CALENDLY_URL en .env.
- Calendly embebido sin token API; verificación adicional opcional en el backend y webhook opcional a GHL.
- Fotos optimizadas WebP, videos MP4 con audio y portadas reales de testimonios.
- Soporte de streaming HTTP por rangos, HEAD, MIME, reproducción inline y errores de medios.
- Captura privada de leads y reservas, validación, cookies de sesión y límite de envíos.
- Función Node.js en `api/`, fallback de rutas de frontend para Vercel y streaming local de MP4.
- Variables de entorno de ejemplo, versiones de Node, lockfile y configuración opcional de VS Code.
- Pruebas del backend y verificador de archivos.

## Orden elegido

Se aplica la indicación del audio más reciente: **landing → segunda página de agenda → preguntas → gracias/no apto**. Los PDF nuevos indican calificación antes del calendario, en la misma landing; esa diferencia queda registrada en `docs/DECISIONES.md`.

Hay un único enlace para entrar a la agenda debajo del VSL, sin botones repetidos por las secciones. Se añade un footer por tu pedido actual, aunque el PDF decía sin footer. Incluye copyright, privacidad, términos y una nota sobre cifras estimadas.

## Para completar los materiales

El proyecto arranca y el flujo demo funciona ahora. Estos elementos todavía no estaban en los archivos del cliente:

- **VSL principal:** colocar `frontend/assets/videos/vsl.mp4`.
- **Inter variable:** colocar `frontend/assets/fuentes/inter-var.woff2`. Mientras tanto se usa la fuente del sistema. Añade la licencia del archivo de fuente que incorpores.
- **Caso Daniel:** identificar su foto. En el ZIP hay Daniela, no una foto identificada como Daniel. El caso permanece oculto; ver `frontend/content.json → pendingCase`.
- **Ajustes de Calendly:** tu enlace ya está incluido. Configurar 45 minutos, Google Meet y disponibilidad máxima de dos días en la cuenta. El token y la URI son opcionales para verificación del servidor.
- **Recursos gratuitos:** configurar `RESOURCES_URL` cuando el cliente entregue el enlace.
- **Datos legales finales:** completar responsable, domicilio y canal formal de contacto en las páginas informativas. Los textos incluidos son provisionales y así se muestran.

No se inventó un VSL ni se asignó la foto de Daniela a Daniel. Las noticias se presentan como tarjetas de texto, con los titulares provistos, sin capturas ni logos falsos. Las fotos de Rogel, Daniela y Marisol y los videos de Rogel/Ana Karen quedan disponibles en assets para futuras secciones; la landing activa usa los casos nuevos de Franciela y Paul y las tres fotos de inversionistas entregadas.

## Variables e integraciones

Copia `.env.example` como `.env` solo cuando quieras cambiar la configuración. Lee `docs/INTEGRACIONES.md`. Los secretos van únicamente en `.env`, nunca en el frontend.

Tu calendario se muestra al iniciar, sin .env ni token. Al recibir el evento de reserva del widget, el sitio habilita las preguntas y guarda su referencia. Sin token no verifica la reserva por API ni inventa fecha, hora o enlace de Meet: la página de gracias remite a la confirmación de Calendly.

La demo es opcional: configura CALENDLY_URL= vacío y DEMO_BOOKING=true en local. Guarda horarios de prueba y respuestas, pero **no envía emails, no crea Meet ni reserva una llamada real**. En producción permanece deshabilitada.

La disponibilidad máxima de 2 días debe configurarse en Calendly. Con token API y URI del evento, el backend también rechaza confirmar reservas fuera de las próximas 48 horas o de duración distinta a 45 minutos; una reserva ya creada en Calendly no se cancela automáticamente.

## Comprobaciones

```sh
npm run check
npm test
```

La verificación de medios marca el VSL y la fuente como pendientes sin impedir el arranque. Trece pruebas cubren el flujo, filtros, seguridad y streaming. Ver `docs/VERIFICACION.md` para alcance y revisión visual pendiente.

## Despliegue en Vercel

Conecta el repositorio Git en Vercel y configura:

| Ajuste | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | `./` (raíz del repositorio) |
| Build Command | `npm run build` |
| Output Directory | `frontend` |

`vercel.json` enruta las páginas directas (`/registro`, `/gracias`, `/no-apto`, `/privacidad`, `/terminos`) al `index.html` y despliega `/api/*` como una función Node. El frontend permanece en `frontend/`; los endpoints no devuelven credenciales.

### Supabase y variables de entorno

En Supabase crea un proyecto y abre **SQL Editor**. Ejecuta el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql). El esquema crea las tablas de reservas, respuestas, sesiones y entregas, además de un rate limit atómico; RLS queda habilitado y la aplicación accede exclusivamente desde el backend con la clave `service_role`.

En **Vercel → Project → Settings → Environment Variables**, define para Production (y también Preview si vas a probar previews):

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | URL HTTPS del proyecto, por ejemplo `https://<project-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta `service_role` del proyecto Supabase |
| `PUBLIC_ORIGIN` | URL pública canónica HTTPS del sitio, sin barra final |
| `CALENDLY_URL` | `https://calendly.com/rubengutierrezdv/new-meeting` |
| `CALENDLY_API_TOKEN` | Opcional; token privado para verificar la reserva con la API de Calendly |
| `CALENDLY_EVENT_TYPE_URI` | Opcional y requerido junto con el token; URI del tipo de evento |
| `GHL_LEAD_WEBHOOK_URL` | Opcional; endpoint HTTPS para entregar respuestas |
| `GHL_WEBHOOK_TOKEN` | Opcional; secreto del webhook |
| `RESOURCES_URL` | Opcional; URL HTTPS de recursos para `/no-apto` |
| `LEAD_RATE_LIMIT` | Opcional; solicitudes permitidas por IP y minuto (por defecto 10 en producción) |

No configures la clave pública `anon` como sustituto de `SUPABASE_SERVICE_ROLE_KEY`. La `service_role` solo va en variables privadas de Vercel y nunca en el frontend, `.env.example`, el repositorio o respuestas de API. Si faltan las variables de Supabase, `/api/config` informa `storageReady: false` y `/registro` deshabilita el proceso; las reservas/respuestas no se simulan ni se guardan en archivos o memoria.

Después de agregar las variables, vuelve a desplegar. Vercel instala con Node `24.x` conforme a `package.json`; `npm run build` ejecuta las verificaciones del proyecto.

### Calendly y verificación

El enlace de Calendly se muestra en `/registro`. El evento `calendly.event_scheduled` solo entrega al navegador una referencia del widget; se conserva como `verification: browser-event-only` y **no** se presenta como reserva verificada por el servidor. Para verificación del servidor, configura `CALENDLY_API_TOKEN` y `CALENDLY_EVENT_TYPE_URI`; el backend consulta al invitado y al evento, valida estado, tipo, duración de 45 minutos y ventana de 48 horas. Configura también esas reglas y Google Meet en Calendly. No se hizo una reserva real durante esta adaptación.

El recorrido permanece landing pública → agenda Calendly en `/registro` → preguntas después de agendar en esa misma página → `/gracias` o `/no-apto`.

## Ejecución local

```sh
npm start
```

Localmente la demo usa `backend/data/*.jsonl` y sesiones en memoria para facilitar la prueba. En producción (`NODE_ENV=production` o Vercel) no se usan archivos ni memoria como almacenamiento persistente: reservas, respuestas, sesiones y rate limits se guardan en Supabase.

Para probar la variante de embed local se puede reservar una cita en Calendly; para evitar una reserva real, limpia `CALENDLY_URL` en `.env` y usa la agenda demo local. La demo no está disponible en producción.

## Pruebas y comandos de publicación

```sh
npm run check
npm test
git add .
git commit -m "Adaptar proyecto para Vercel"
git push origin main
```

El push activa el despliegue conectado de Vercel; también puedes pulsar **Redeploy** en el último Deployment después de configurar las variables. Estos comandos son para que los ejecutes tú: no se hizo commit ni push.

Las extensiones de VS Code son opcionales; ninguna es requisito de ejecución. No se incluyen cuentas, contraseñas del dominio ni credenciales del cliente.

## Presentación visual 5.2

Header con nombre y proyecto alineados; main de 800 px, títulos equilibrados, testimonios en dos columnas en escritorio y una en móvil; bloque de confianza continuo; ubicación con separación propia y footer en dos niveles. Los textos, secciones y backend se conservan.

El fondo estático usa la foto real `assets/imagenes/construccion.webp`, con capas marino y rejilla discretas. No es una fotografía inventada ni un render de otro edificio. Puede reemplazarse por una foto definitiva autorizada cambiando `--foto-fondo` en styles.css. No tiene animación ni parallax.

## Entrega liviana

Esta copia conserva frontend, backend, configuración, Calendly y los cuatro videos. Incluye las fotografías optimizadas WebP en lugar de duplicar JPG/PNG; los originales siguen en los materiales entregados por el cliente. Los MP4 se optimizaron con H.264, CRF 26, límite de bitrate 650 kbps, audio AAC y faststart. No se cambió su contenido ni duración.
