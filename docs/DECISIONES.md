# Decisiones y fuentes

Se leyeron los dos PDF nuevos, la guía de marca, las instrucciones anteriores y los documentos de Franciela, Daniela y Paul. El contenido nuevo reemplaza el antiguo. Se usa la transcripción del audio enviada en la conversación para el recorrido.

| Tema | Documentos / conversación | Implementación |
| --- | --- | --- |
| Entrada | Todos los nuevos materiales eliminan el gate | Landing pública, sin nombre/email previo |
| Agenda | Audio: segunda página, Calendly antes de preguntas. PDF: GHL y preguntas primero, en la landing | Audio como indicación más reciente: /registro, agenda → preguntas |
| CTA | PDF elimina los botones; audio separa la segunda página | Un único enlace a /registro bajo el VSL; sin CTAs repetidos |
| Footer | PDF dice sin footer; pedido actual solicita cierre profesional | Copyright, privacidad, términos y nota informativa |
| Color | Branding define marino, blanco, plata, oro, azul y coral | #000017, #FFFFFF, #CDD1DA, #E0C37F, #73A4FF, #FF8A80 |
| Tipografía | Inter variable local; archivo no entregado | Soporte de inter-var.woff2, respaldo del sistema |
| Casos | Nuevo maquetado: Franciela, Paul y Daniel. Nota técnica menciona Daniela | Franciela y Paul activos con sus MP4; Daniel oculto hasta identificar foto |
| Inversionistas | PDF solicita cuatro fotos; ZIP contiene tres carruseles | Tres fotos reales, sin inventar una cuarta |
| Noticias | PDF proporciona títulos; no recortes ni logos entregados | Tarjetas con nombre del medio y titular, sin links de salida |
| Calificación negativa | En audio las preguntas ocurren tras reservar | /no-apto y conservación de la reserva; no se cancela sin indicación |
| Recursos gratis | Sin URL entregada | Estado próximamente; variable RESOURCES_URL |
| Textos legales | No se entrega responsable/domicilio/canal formal | Textos informativos provisionales, indicación visible para completar |

La oferta reproduce el texto del maquetado, incluida la expresión “Plusvalía garantizada del 15% anual”. Las afirmaciones de inversión, PROFECO y CONSUR provienen del cliente; no se hicieron comprobaciones documentales independientes de esas afirmaciones. El pie incorpora una nota sobre cifras estimadas, por el pedido actual de cierre profesional.

Las referencias PDF vigentes están en `docs/referencias`. Las credenciales del documento de acceso al dominio no son necesarias para desarrollar ni ejecutar localmente y no se incluyen en el proyecto.

## Actualización 5.1

Se incorpora el enlace público https://calendly.com/rubengutierrezdv/new-meeting enviado por Rubén. El widget funciona por defecto, sin token ni .env. Se conserva la verificación API como opción; la referencia del widget por sí sola se marca explícitamente como no verificada en servidor. No se cambiaron ajustes de la cuenta ni se realizaron reservas reales.

## Actualización visual 5.2

A pedido del usuario se refina la presentación de header/main/footer y se incorpora un fondo fotográfico estático. Se usa la imagen de construcción del cliente, oscurecida mediante CSS; se mantienen los colores de marca. No se crean nuevas secciones, frases comerciales, logos ni testimonios. La comparación con 5.1 confirma que content.json y backend/server.mjs permanecen idénticos.
