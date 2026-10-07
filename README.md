# BOSCO · revisión final para Vercel y adaptación a GHL

Incluye el VSL entregado, testimonios, fotos, noticias, paleta existente y el nuevo botón dorado. La acción del botón lleva al formulario inmediatamente debajo del VSL. El flujo de referencia es el último PDF: preguntas → si califica, calendario → reserva real → gracias. Conserva las correcciones posteriores del cliente (Francelia, 15 años de CONSUR, cuatro razones, cinco beneficios, Rogel y Ana Karen sin relatos).

## Ver localmente

Node 20 o superior (recomendado 24). No hay dependencias externas de npm.

```bash
npm install
npm run dev
```

Abrir http://localhost:5173. Esta versión es una **vista previa**: las preguntas funcionan para comprobar los filtros, pero no guarda datos ni inventa horarios o reservas. Los visitantes verán una advertencia hasta conectar GHL. No es una versión lista para captar prospectos.

## Ver en Vercel

Framework: Other. Build command: `npm run build`. Output directory: `public`. El archivo vercel.json incluye las rutas. En Vercel el formulario continúa siendo una vista previa sin guardado. Usar preferiblemente Preview Deployment para la revisión, sin dirigir tráfico de anuncios.

## Pasar a GHL

Leer docs/INSTALAR-EN-GHL.md. GHL aloja las páginas y usa sus contactos, formulario, calendario y workflows. El servidor Node solo sirve para revisar localmente; no se pega ni se ejecuta dentro de GHL.

1. Subir assets a Media Storage de la subcuenta y copiar sus URLs públicas.
2. Completar config-ghl.json con URLs de medios y el embed del recorrido nativo de GHL.
3. Configurar preguntas, filtros, calendario, resultados y seguimientos en la subcuenta.
4. Revisar el aviso de privacidad y probar el recorrido nativo.
5. Ejecutar `npm run build:ghl` y pegar cada archivo generado de PARA_PEGAR_GHL en un bloque Custom HTML/JS de su página.

La generación de producción se detiene si faltan medios, embeds o revisiones. No usa contraseñas, claves API ni llamadas al backend del ZIP viejo. Código/HTML/CSS está autocontenido en cada bloque; el diseño queda aislado del CSS del constructor mediante Shadow DOM. Probar siempre en la vista pública de GHL: algunos editores no ejecutan los scripts en el canvas de edición.

## Qué sigue pendiente

- Embeds reales y pruebas de guardado, redirecciones, identidad entre formulario y calendario y reserva.
- Google Calendar/Meet y horarios de Marisol.
- WhatsApp, pipeline y workflows, incluyendo el PDF del regalo (no estaba en los adjuntos).
- URL dinámica del botón Agregar a Google Calendar y selección del resultado con acompañante.
- Revisión del aviso de privacidad adaptado; conexión del dominio.
- Comprobación visual en navegador y reproducción real en móvil/GHL.

No se considera una reserva confirmada por hacer clic o recibir un mensaje arbitrario del iframe. La página de gracias se debe asignar como confirmación del calendario nativo.

## Respaldo

version-node-original contiene el código recibido, sin credenciales, datos locales ni historial Git. No participa en el build nuevo; sirve para comparar o recuperar el backend anterior. Los medios compartidos están en assets.
