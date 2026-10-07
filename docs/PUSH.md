# Subir una revisión sin reemplazar la web pública

Trabajar dentro de tu clon existente de https://github.com/RubenEduardoG/landing_oficial, donde git status muestra el repositorio correcto. Hacer una copia de la carpeta antes de reemplazar archivos. Copiar el contenido de BOSCO_GHL_Final a esa raíz (package.json debe quedar junto al del proyecto, reemplazándolo; no como otra carpeta anidada). El ZIP no incluye historial Git ni credenciales.

Los archivos frontend/backend anteriores no se borran por copiar esta revisión. El build nuevo usa contenido.json, codigo, scripts y assets. No activar anuncios ni captar prospectos con esta vista previa.

```bash
git remote -v
git status
git switch -c revision-final-ghl
npm install
npm run build
npm run check
npm test
git add package.json package-lock.json vercel.json .gitignore .env.example README.md config-ghl.json contenido.json codigo scripts assets docs vista-previa version-node-original
git diff --cached --stat
git commit -m "Integra VSL y prepara revision visual para GHL"
git push -u origin revision-final-ghl
```

Verificar que origin sea RubenEduardoG/landing_oficial antes del push. Si ya existe esa rama, usar git switch revision-final-ghl. El archivo package-lock.json se crea con npm install. Revisar git diff antes de confirmar. No usar force push ni git init dentro de este repositorio existente.

En Vercel, comprobar el Preview Deployment de la rama. Si tu proyecto solo despliega la rama de producción, importar la rama para revisión o habilitar los previews; no hacer merge hasta revisar la web. No se ejecutó ningún push desde este paquete.
