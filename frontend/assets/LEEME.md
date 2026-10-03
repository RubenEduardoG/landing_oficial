# Medios de la entrega 6.0

Videos activos: `videos/francelia.mp4`, `videos/paul.mp4`, `videos/rogel.mp4` y `videos/ana-karen.mp4`. Son MP4 H.264/AAC optimizados, con metadatos al inicio. Sus portadas están en `imagenes` y sus rutas se definen en content.json. El backend local admite HEAD y Range; Vercel sirve los medios como archivos estáticos.

Pendiente: colocar el video principal en `videos/vsl.mp4`. Es independiente de los cuatro testimonios. No tiene autoplay; controles de reproducción, sonido y pantalla completa. Los testimonios tienen controles nativos.

Fotos finales: `imagenes/inversionistas-1.webp`, `inversionistas-2.webp` e `inversionistas-3.webp` contienen los documentos difuminados. No reemplazar por los originales si se desea conservar la privacidad. La galería usa proporción 3:4 y recorte cover.

CONSUR: dos fotos del sitio oficial, guardadas localmente; fuentes en docs/CORRECCIONES-OCTUBRE.md. Las ilustraciones de contrato y permisos son CSS decorativo, no documentos reales.

Fuente: se usa la del sistema. Si el cliente entrega Inter, incorporar el archivo y su licencia, y añadir la regla @font-face correspondiente en styles.css. No se hacen sondeos de un archivo ausente.

Para agregar un medio utilizar rutas `/assets/...`, nunca rutas Windows, Drive ni /workspace. `npm run check` comprueba medios activos; el VSL pendiente no impide arrancar.
