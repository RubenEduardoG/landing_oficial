# Verificación versión 6.1

- npm run check: sintaxis Node del servidor, storage, función Vercel y frontend; comprobación de rutas de medios requeridos.
- npm test: 16 pruebas pasaron. Incluyen rutas, streaming HEAD/Range, agenda demo, filtros, origen, rate limit, Calendly con API simulada y persistencia Supabase con respuestas simuladas.
- Render del frontend en DOM simulado: cuatro videos y caso Daniela con foto; nombre Francelia; cuatro razones; encabezado de 50 familias; /registro con agenda antes del formulario; preguntas tras reservar; página de gracias.
- Imágenes de documentos editadas inspeccionadas visualmente: texto ilegible.
- ZIP: comprobación CRC y extracción completa.

No se probaron contra una cuenta real Supabase/GHL, no se creó una reserva Calendly y no se enviaron emails/WhatsApp. La revisión visual responsive en navegador de esta versión queda pendiente: el navegador disponible rechazó localhost con ERR_BLOCKED_BY_CLIENT. La estructura CSS aplica una columna en bloques de confianza/oferta en móvil y dos en escritorio, pero esto no sustituye una prueba visual en dispositivos.

Pendientes de materiales: VSL principal, datos legales definitivos. Se eliminó el sondeo de una fuente ausente: la fuente del sistema se usa por defecto.
