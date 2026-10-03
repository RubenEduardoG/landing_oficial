# BOSCO · correcciones del cliente · versión 6.1

Esta entrega parte del código actual de `RubenEduardoG/landing_oficial`, descargado el 3 de octubre de 2026. Conserva el frontend HTML/CSS/JS, backend Node y configuración de Vercel del proyecto publicado. No fue publicada automáticamente.

## Ejecutar

Instala Node.js 24.x. Abre la terminal en esta carpeta:

```sh
npm install
npm run dev
```

Abre http://localhost:5173. No hay dependencias de terceros para el runtime. Node y npm deben estar instalados en tu equipo.

La URL real de Calendly se conserva por defecto. Para probar el recorrido SIN crear reuniones reales, copia `.env.example` a `.env`, deja `CALENDLY_URL=` vacío y usa `DEMO_BOOKING=true` y `NODE_ENV=development`. Reinicia el servidor. Los horarios demo guardan datos locales y no envían correos ni crean Google Meet.

## Correcciones aplicadas

- Francelia: nombre visible y rutas corregidos.
- Cuatro videos visibles: Francelia, Paul, Rogel y Ana Karen. También se incorpora el caso Daniela con su fotografía y datos del documento original. Para estos dos últimos no se inventaron citas ni cifras; se muestran sus videos y nombres.
- Eliminada la antigua razón de contrato notarial: quedan cuatro razones, renumeradas y presentadas en bloques alternados con imágenes/ilustraciones.
- Nuevo texto de PROFECO, permisos y la inversión personal de Marisol.
- CONSUR: 15 años de experiencia, también en la ficha de ubicación.
- Plusvalía sostenida del 15% en los últimos 4 años. Se retiraron la garantía y la proyección numérica de ese bloque.
- Eliminado el beneficio de comunidad/grupo privado.
- Documentos de las tres fotos finales difuminados en los archivos de imagen, no únicamente por CSS.
- Encabezado: “Más de 50 familias invirtiendo y viendo resultados”.
- Acentos azules y dorados, estrellas decorativas, apariciones suaves, bloques alternados y página de gracias con el mismo tratamiento. Las animaciones respetan reducir movimiento.
- Página 2 con Calendly primero, indicación de pasos y preguntas habilitadas después de agendar, sin pedir datos al entrar a la landing.

## Vercel

Conserva `vercel.json`. Configuración: Framework Other, Root Directory raíz del proyecto, Build Command `npm run build`, Output Directory `frontend`, Node 24.x.

El backend actual del repositorio utiliza Supabase para persistencia en Vercel. Para mantener esta versión operativa allí, hacen falta `PUBLIC_ORIGIN`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, además de ejecutar `supabase/schema.sql`. Nunca publiques claves. Sin almacenamiento configurado el registro se bloquea deliberadamente para evitar pérdida de datos. El ZIP no contiene credenciales.

No borres tu repositorio ni sus variables. Copia los archivos de esta entrega a tu carpeta actual conservando la carpeta Git. Elimina allí las rutas antiguas `frontend/assets/videos/franciela.mp4` y `frontend/assets/imagenes/franciela-video.webp` después de copiar los nombres nuevos, para evitar duplicados. Revisa `git diff` y ejecuta `npm run check` y `npm test` antes de subir.

## GoHighLevel

La plataforma final elegida es GoHighLevel. Esta entrega conserva el soporte existente de Vercel y el webhook opcional a GHL; no añade infraestructura nueva. La migración y conexión real a la cuenta de GHL requieren configuración externa. Lee `docs/GOHIGHLEVEL.md`. No es un archivo de importación nativa de un funnel de GHL ni un backend Node ejecutable dentro de su editor.

## Materiales pendientes

- Video principal: `frontend/assets/videos/vsl.mp4`.
- Documentos reales de contrato y permisos, si el cliente quiere sustituir las ilustraciones.
- No se añadió un caso separado de Daniel: el documento original identifica a Daniela, que ahora está visible con su foto y resumen.
- Datos legales definitivos y enlace de recursos gratuitos.
- Configuración de GHL y decisión de conservar Calendly o usar calendario GHL. Se conserva Calendly mientras tanto.

Las fotos de CONSUR provienen de su web oficial y se rotulan “Proyectos de CONSUR”; no se presentan como pruebas de proyectos entregados ni como fotos de BOSCO. El dato de 15 años y las afirmaciones comerciales se aplican según el texto del cliente; no se certificaron con documentación legal.

## Verificación

`npm run check` y `npm test`: 16 pruebas del backend. También se verificó el render del frontend mediante DOM simulado: cuatro videos, agenda primero, formulario posterior y gracias. La revisión visual en navegador de esta versión y una reserva real de Calendly no se completaron; el navegador de este entorno bloqueó localhost. No se enviaron leads ni mensajes externos.

Consulta `docs/CORRECCIONES-OCTUBRE.md` para criterios y `docs/VERIFICACION.md` para alcance.

## Checklist de activación

Ver docs/PENDIENTES-PARA-TERMINAR.md: materiales faltantes, cuenta destino, campos de GHL, agenda y configuración mientras se use Vercel.
