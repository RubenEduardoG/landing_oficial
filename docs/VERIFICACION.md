# Verificación de entrega

Ejecutado con Node v24.19.0.

- `npm run check`: sintaxis de frontend/backend y rutas de archivos activos correctas.
- `npm test`: 13 pruebas aprobadas.
- Videos inspeccionados con ffprobe: los cuatro MP4 entregados tienen video H.264 y audio AAC; en la entrega liviana se recodificaron a H.264 CRF 26, límite de bitrate 650 kbps y AAC con faststart.
- Copias WebP generadas desde las fotos reales; portadas desde los MP4 reales.
- ZIP extraído en una carpeta nueva: `npm run dev` inició correctamente sin instalación ni .env. Health, landing, configuración e imagen respondieron 200; MP4 parcial respondió 206 con 100 bytes.

Las pruebas cubren acceso público, protección de archivos privados, streaming parcial/HEAD, rangos inválidos, reserva dentro de 48 horas, exclusión de dobles reservas demo concurrentes, agenda antes de preguntas, persistencia de lead, consentimiento, opciones válidas, tres filtros negativos, condicional de acompañante, límite de envíos y demo deshabilitada en producción. Se agregó una prueba del enlace por defecto sin token ni .env, y del modo de referencia de widget sin fechas inventadas. La integración Calendly por API se probó con respuestas API simuladas, incluyendo rechazo de evento distinto, duración incorrecta y reserva tardía.

Se integró el enlace público de Calendly enviado por el usuario; no se inició sesión en la cuenta, no se hizo una reserva real ni se conectó GHL, no se enviaron correos ni WhatsApp. No se completó una revisión visual en un navegador real en este entorno; la distribución responsive debe revisarse en escritorio y móvil al abrir el proyecto. No se afirma una prueba real de reproducción en iPhone.

## Revisión manual al abrir

1. Ver landing sin gate; revisar colores, títulos, secciones, noticias, fotos y footer.
2. Reproducir Franciela y Paul con audio; revisar orientación y fullscreen.
3. Añadir vsl.mp4 y revisar controles sin duración, sin autoplay ni poster.
4. Entrar a /registro y comprobar el Calendly integrado. Para pruebas sin reservar externamente, configurar CALENDLY_URL vacío en .env, elegir horario demo y enviar nueve respuestas y consentimiento.
5. Confirmar /gracias demo y bloque condicional según pregunta 9.
6. En otra ventana privada, enviar uno de los tres filtros negativos y confirmar /no-apto.
7. Revisar que los archivos JSONL aparezcan únicamente en backend/data.
8. Repetir con Calendly configurado antes de publicar; revisar confirmación, Meet y Google Calendar.

## Verificación visual 5.2

`npm run check` y las 13 pruebas vuelven a pasar. La plantilla de landing se ejecutó en un entorno DOM simulado para comprobar que conserva un header, un main, un footer, un H1, cuatro secciones principales, dos testimonios, once elementos de confianza/oferta y un único enlace a registro. Se compararon los bytes del contenido y backend con 5.1: sin cambios. Esta comprobación estructural no sustituye la revisión visual en navegador, que permanece pendiente en escritorio y móvil.

La entrega liviana se creó nuevamente después de detectar que el ZIP descargado estaba truncado. Se comprueba CRC y extracción completa antes de entregar.
