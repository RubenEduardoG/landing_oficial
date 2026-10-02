# Imágenes, videos y fuentes

Todas las rutas son locales, sin depender de Drive ni de enlaces temporales.

## Videos

- `videos/franciela.mp4` y `videos/paul.mp4`: usados en los casos nuevos.
- `videos/rogel.mp4` y `videos/ana-karen.mp4`: entregados, disponibles para futuras secciones.
- `videos/vsl.mp4`: pendiente. Colocar aquí el VSL real, no modificar el código.

Los videos entregados contienen H.264 y audio AAC. En esta entrega liviana se optimizó la compresión H.264 (CRF 26, límite de bitrate 650 kbps), con audio AAC y faststart, para comenzar la reproducción antes de descargar el archivo completo. El servidor admite streaming por rangos y reconoce `.mp4` / `.webm`, incluso nombres con extensión en mayúsculas.

El VSL utiliza controles propios: reproducir/pausar, sonido y pantalla completa. No muestra tiempo total ni barra de progreso. No tiene poster ni autoplay. Los testimonios usan controles nativos y portadas extraídas de sus propios videos. En iPhone se usa reproducción inline cuando el dispositivo la admite.

Para un nuevo video se recomienda MP4 H.264/AAC, y metadatos al inicio. Si usas WebM, cambia la ruta y el tipo MIME del source en app.js. El soporte del servidor no modifica automáticamente el tipo declarado del elemento video.

## Fotos

La carpeta `imagenes` incluye copias WebP de máximo 1600 px para la web. Se normaliza la orientación EXIF. Las fotos de construcción y carruseles están activas. Marisol, Daniela y Rogel están disponibles sin asignar identidades distintas.

`content.json` define todas las rutas activas. Actualiza esos valores si cambias los nombres. Usa `/assets/...`, sin una ruta de Windows, sin `/workspace/...` y sin enlaces de Drive. Para Daniel, agrega una foto identificada, define pendingCase.image y cambia pendingCase.enabled a true.

Las imágenes se cargan de forma diferida fuera del hero, mantienen proporciones y muestran un mensaje si no pueden cargarse. Las imágenes de inversionistas usan recorte cuadrado; si necesitas verlas completas cambia object-fit:cover por contain en styles.css.

## Fuente

Agregar `fuentes/inter-var.woff2` (Inter variable, pesos 100–900). El frontend detecta el archivo y carga la fuente cuando existe. Sin ella, usa la del sistema para evitar bloquear el contenido. Incluye la licencia correspondiente al incorporar la fuente.

## Validación

`npm run check` verifica todos los medios activos. El VSL y la fuente son pendientes opcionales, no fallos de arranque.

## Fondo estático 5.2

El CSS utiliza la misma foto de construcción ya incluida, bajo una capa marino oscura. `--foto-fondo` en styles.css permite sustituirla por otra imagen del cliente. Se conserva el archivo original, sin modificar su contenido. El fondo se posiciona fijo y no participa de la lectura ni del foco de teclado.
