# Instalación

## 1. Medios

En la subcuenta BOSCO DEPARTAMENTOS, crear una carpeta BOSCO en Media Storage y subir cada archivo de assets. Para cada archivo copiar la URL pública HTTPS al valor correspondiente de `assets` en config-ghl.json. No sirven rutas del escritorio, enlaces de visor de Drive/Frame.io ni `/assets/...` dentro de GHL. El exportador reemplaza las rutas de imágenes, vídeos y fondo en el contenido y CSS.

El VSL se entrega en MP4 H.264/AAC con faststart, a 720p (optimizado para la web desde el original de 1080p); se mantiene entero. Controles de reproducir/pausar, sonido y pantalla completa, sin autoplay, sin portada, sin barra de progreso ni duración. Los testimonios mantienen controles nativos.

## 2. Formulario y agenda reales

El ZIP no tiene acceso a la subcuenta. Crear o ajustar un formulario/survey **nativo** con las preguntas de CUESTIONARIO.json. Todos los campos son obligatorios. Mapear los tres datos personales a campos estándar y las seis respuestas a campos personalizados. Configurar las opciones y las reglas en GHL, no solo en la vista previa JavaScript.

Cualquier negativo entre plazo “Todavía lo estoy evaluando”, capital “Menos de $250,000 MXN” y mensualidad “Menos de $5,000” lleva a No apto. No filtrar por experiencia, objetivo ni decisión compartida. Comprobar que el contacto y sus respuestas se guarden también cuando no califica: probar el comportamiento real de las acciones Redirect y Disqualify antes de elegirlas.

`qualificationEmbedUrl` debe apuntar al **recorrido nativo de calificación y agenda**. Su calendario debe aparecer solo al pasar los filtros. El iframe se encuentra debajo del VSL; no sustituirlo por un calendario que permita saltarse la calificación. No se han implementado callbacks de iframe no documentados. Se incluyen páginas de agenda y resultados para construir ese recorrido nativo en la subcuenta. Validar la navegación del embed en vista publicada, incluyendo que no aparezcan encabezados duplicados, que no se recorten preguntas y que el registro siga en la misma landing. Ajustar `formHeight` según el alto real del widget.

Si el formulario nativo deriva a una página independiente de agenda, esa variante requiere revisar la ubicación con el maquetado: no asumir que equivale al requisito de formulario + calendario dentro de la landing. No marcar nativeFlowVerified hasta comprobar la versión elegida.

## 3. Calendario

`calendarEmbedUrl`: copiar el enlace HTTPS desde Calendars > Calendar Settings > Share. Sesión de 45 minutos, America/Mexico_City, lunes a viernes 10:00–20:00, sábado 10:00–13:00, domingo cerrado. Máximo dos días de anticipación. Conectar Google Calendar para evitar conflictos y Google Meet para crear el enlace real. Configurar confirmación y recordatorios; una cita cerca de su hora no debe recibir mensajes de “10 horas antes” fuera de tiempo.

Asignar Gracias como redirección de **reserva completada**, nunca de envío del formulario o de selección del horario. Para decisión compartida usar gracias-acompanado; para “decido yo solo” usar gracias. GHL debe seleccionar la ruta según su campo guardado, o controlar el bloque condicional nativamente. El parámetro showDecisionCompanion de la plantilla es fijo y no detecta automáticamente contactos.

`calendarAddUrl` acepta solo el enlace real de la cita/invitación. Mientras no esté disponible, se omite el botón; no poner una fecha fija ni un enlace genérico a Google Calendar. Su personalización depende de la integración real con el calendario. El exportador no puede inventarla.

## 4. Páginas

Crear páginas Landing, Agenda (para el recorrido interno cuando corresponda), Gracias, Gracias acompañado, No apto y Privacidad. Reemplazar homeUrl y privacyUrl por las rutas reales. Copiar todo el archivo HTML generado a Custom HTML/JS, en una sección full width sin padding ni header/footer duplicados del constructor.

El aviso es un **borrador**: el documento legal recibido afirma que no se recogen datos financieros/patrimoniales, pero el cuestionario pide capital y capacidad mensual. Se corrigió el apartado de datos recopilados para describir esas preguntas. El responsable debe revisar este ajuste y el tratamiento en GHL/WhatsApp/Google antes de aprobar. No se declara cumplimiento legal ni se inventa una fecha de revisión.

## 5. Exportar

En config-ghl.json establecer privacyApproved y nativeFlowVerified en true solamente después de las revisiones reales. Ejecutar npm run build:ghl. Se generan los archivos para pegar con URLs absolutas. No publicar las plantillas de vista previa como producción.

## 6. Prueba final

Probar: todos los campos obligatorios; perfil apto; cada filtro negativo separado y combinaciones; contacto único y campos guardados; calendario sin acceso antes de calificar; citas ocupadas; dos días máximos; correo/Meet; gracias con y sin acompañante; envío del regalo solo tras reserva; cancelación, reprogramación y corte de recordatorios. Comprobar todos los vídeos en Android/iPhone y Chrome/Safari, tanto en escritorio como en 390px de ancho.

Fuentes oficiales consultadas:
- https://help.gohighlevel.com/support/solutions/articles/48000982201
- https://help.gohighlevel.com/support/solutions/articles/155000001314
- https://help.gohighlevel.com/support/solutions/articles/48001076135-adding-custom-forms-to-calendars
- https://help.gohighlevel.com/support/solutions/articles/48001216629-media-storage-file-types-limits-advanced-features
