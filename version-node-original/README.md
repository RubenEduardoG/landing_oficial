# BOSCO · correcciones del cliente · versión 6.1

Esta entrega parte del código actual de `RubenEduardoG/landing_oficial`, descargado el 3 de octubre de 2026. Conserva el frontend HTML/CSS/JS, backend Node y configuración de Vercel del proyecto publicado. No fue publicada automáticamente.

## Ejecutar

Instala Node.js 24.x. Abre la terminal en esta carpeta:

```sh
npm install
npm run dev
```

Abre http://localhost:5173. No hay dependencias de terceros para el runtime. Node y npm deben estar instalados en tu equipo.

La agenda demo local es el modo predeterminado de desarrollo. Los horarios demo guardan datos locales, pero no crean una reunión ni envían correos o mensajes. Para revisar el formulario sin reservar ni guardar/enviar datos, abre http://localhost:5173/registro?preview=1. El formulario de producción espera la agenda y confirmación verificable de GHL; configurar solamente el embed no confirma reservas ni habilita las preguntas.

## Correcciones aplicadas

- Francelia: nombre visible y rutas corregidos.
- Se conservan completos los relatos de Francelia y Paul; Rogel y Ana Karen aparecen en tarjetas compactas con nombre y video. También se incorpora el caso Daniela con su fotografía y datos del documento original.
- Eliminada la antigua razón de contrato notarial: quedan cuatro razones, renumeradas y presentadas en bloques alternados con imágenes/ilustraciones.
- Nuevo texto de PROFECO, permisos y la inversión personal de Marisol.
- CONSUR: 15 años de experiencia, también en la ficha de ubicación.
- Plusvalía sostenida del 15% en los últimos 4 años. Se retiraron la garantía y la proyección numérica de ese bloque.
- Eliminado el beneficio de comunidad/grupo privado.
- Documentos de las tres fotos finales difuminados en los archivos de imagen, no únicamente por CSS.
- Encabezado: “Más de 50 familias invirtiendo y viendo resultados”.
- Acentos azules y dorados, estrellas decorativas, apariciones suaves, bloques alternados y página de gracias con el mismo tratamiento. Las animaciones respetan reducir movimiento.
- Recorrido landing → agenda → datos y seis preguntas → resultado; sin registro al entrar a la landing.
- Cuestionario definitivo: experiencia, objetivo, plazo, capital, mensualidad y decisión; el backend persiste estos valores junto con los datos personales.
- Únicos filtros “No apto”: plazo “Todavía lo estoy evaluando”, capital “Menos de $250,000 MXN” y mensualidad “Menos de $5,000”.
- Vista previa explícita del formulario, aislada de las API y del guardado/envío real.
- Pantalla “No apto” con el texto solicitado y sin enlaces inventados ni promesas de envío de mensajes.

## Vercel

Conserva `vercel.json`. Configuración: Framework Other, Root Directory raíz del proyecto, Build Command `npm run build`, Output Directory `frontend`, Node 24.x.

El backend actual del repositorio utiliza Supabase para persistencia en Vercel. Para mantener esta versión operativa allí, hacen falta `PUBLIC_ORIGIN`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, además de ejecutar `supabase/schema.sql`. Nunca publiques claves. Sin almacenamiento configurado el registro se bloquea deliberadamente para evitar pérdida de datos. El ZIP no contiene credenciales.

No borres tu repositorio ni sus variables. Copia los archivos de esta entrega a tu carpeta actual conservando la carpeta Git. Elimina allí las rutas antiguas `frontend/assets/videos/franciela.mp4` y `frontend/assets/imagenes/franciela-video.webp` después de copiar los nombres nuevos, para evitar duplicados. Revisa `git diff` y ejecuta `npm run check` y `npm test` antes de subir.

## GoHighLevel

La integración final elegida es GoHighLevel para agenda, contactos y automatizaciones, conectado a Google Calendar y Google Meet, sin Calendly. `GHL_CALENDAR_URL` permite configurar el embed, pero el callback/webhook de confirmación y GHL todavía no están conectados. Se conserva el soporte de Vercel, almacenamiento y webhook opcional. Lee `docs/GOHIGHLEVEL.md`.

## Materiales pendientes

- Video principal: `frontend/assets/videos/vsl.mp4`.
- Documentos reales de contrato y permisos, si el cliente quiere sustituir las ilustraciones.
- No se añadió un caso separado de Daniel: el documento original identifica a Daniela, que ahora está visible con su foto y resumen.
- Datos legales definitivos y enlace de recursos gratuitos.
- Configuración de GHL, calendario Google Calendar/Meet, automatizaciones y confirmación de que los filtros coinciden con el formulario original de GHL.

Las fotos de CONSUR provienen de su web oficial y se rotulan “Proyectos de CONSUR”; no se presentan como pruebas de proyectos entregados ni como fotos de BOSCO. El dato de 15 años y las afirmaciones comerciales se aplican según el texto del cliente; no se certificaron con documentación legal.

## Verificación

`npm run check` y `npm test`: correctos; 14 pruebas pasaron. Vista previa y landing comprobadas en localhost en desktop y celular; el formulario de vista previa no hizo llamadas de escritura. No se conectaron calendarios/cuentas externas ni se enviaron leads o mensajes.

Consulta `docs/CORRECCIONES-OCTUBRE.md` para criterios y `docs/VERIFICACION.md` para alcance.

## Checklist de activación

Ver docs/PENDIENTES-PARA-TERMINAR.md: materiales faltantes, cuenta destino, campos de GHL, agenda y configuración mientras se use Vercel.
