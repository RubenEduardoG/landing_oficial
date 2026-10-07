# Decisiones y fuentes

Los PDF `Pipeline_Mensajes_GHL.pdf` y `Empresas que llegan a Yucatán.pdf`, solicitados para esta tarea, no estaban disponibles en el workspace; no se pudieron leer ni validar sus textos o tiempos. Las instrucciones operativas de GHL añadidas para esta revisión se limitan a lo escrito en la solicitud. Las notas de decisiones anteriores que mencionan otros materiales son antecedentes y no prueban que estos dos archivos se hayan revisado.

| Tema | Documentos / conversación | Implementación |
| --- | --- | --- |
| Entrada | Todos los nuevos materiales eliminan el gate | Landing pública, sin nombre/email previo |
| Agenda | Los PDF ubican el formulario bajo el VSL y califican antes de reservar. La instrucción posterior mantiene agenda primero | Recorrido landing → agenda → datos/preguntas → resultado; GHL pendiente, sin confirmación simulada |
| CTA | PDF elimina los botones; audio separa la segunda página | Un único enlace a /registro bajo el VSL; sin CTAs repetidos |
| Footer | PDF dice sin footer; pedido actual solicita cierre profesional | Copyright, privacidad, términos y nota informativa |
| Color | Branding define marino, blanco, plata, oro, azul y coral | #000017, #FFFFFF, #CDD1DA, #E0C37F, #73A4FF, #FF8A80 |
| Tipografía | Inter variable local; archivo no entregado | Soporte de inter-var.woff2, respaldo del sistema |
| Casos | Instrucción actual: mantener relatos completos salvo Rogel y Ana Karen | Francelia y Paul conservan relatos; Rogel y Ana Karen tienen tarjetas compactas de nombre/video |
| Inversionistas | PDF solicita cuatro fotos; ZIP contiene tres carruseles | Tres fotos reales, sin inventar una cuarta |
| Noticias | PDF proporciona títulos; no recortes ni logos entregados | Tarjetas con nombre del medio y titular, sin links de salida |
| Calificación negativa | En audio las preguntas ocurren tras reservar | /no-apto y conservación de la reserva; no se cancela sin indicación |
| Recursos gratis | Instrucción actual: no inventar enlaces | No se muestra enlace de recursos en “No apto” |
| Textos legales | No se entrega responsable/domicilio/canal formal | Textos informativos provisionales, indicación visible para completar |

La oferta usa el texto de plusvalía sostenida del 15% en los últimos cuatro años indicado posteriormente por el cliente; no se presenta como garantía. Las afirmaciones de inversión, PROFECO y CONSUR provienen del cliente; no se hicieron comprobaciones documentales independientes de esas afirmaciones. El pie mantiene la nota informativa del sitio.

Las referencias PDF vigentes están en `docs/referencias`. Las credenciales del documento de acceso al dominio no son necesarias para desarrollar ni ejecutar localmente y no se incluyen en el proyecto.

## Formulario y recorrido vigentes

El formulario incluye nombre, WhatsApp, correo y las seis preguntas de experiencia, objetivo, plazo, capital, mensualidad y decisión. Validación y persistencia Node aceptan solo esas opciones; no se guardan los campos retirados `mexico` ni `identification`. Las únicas reglas “No apto” son plazo “Todavía lo estoy evaluando”, capital “Menos de $250,000 MXN” y mensualidad “Menos de $5,000”. Confirmar que coincidan con la configuración del formulario original de GHL antes de producción.

El recorrido pedido posteriormente prevalece sobre los PDF: página de landing/VSL sin gate, después agenda, después datos y preguntas en esa misma página, y finalmente “Gracias” o “No apto”. El preview explícito permite revisar el formulario sin solicitudes ni escrituras reales. La URL del embed GHL es configurable pero no constituye una confirmación de reserva; hace falta una integración de confirmación verificada.

La página “No apto” conserva la reserva y el contenido aprobado. En “Gracias” el bloque de acompañante se renderiza únicamente si la respuesta a quién decide no es “Sí, decido yo solo”. No se informa que se creó una reunión de Meet ni que se envió un correo sin una confirmación de integración.
