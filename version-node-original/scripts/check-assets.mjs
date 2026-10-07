import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../frontend');
const c=JSON.parse(await readFile(path.join(root,'content.json'),'utf8'));
const required=[c.assets.project,...c.assets.investors,...c.cases.flatMap(x=>[x.video,x.poster,x.image].filter(Boolean)),c.assets.marisol,...c.trustMedia.flatMap(x=>x.images|| (x.image?[x.image]:[]))];
let failed=false;
for(const file of required){try{const s=await stat(path.join(root,file));if(!s.isFile() || !s.size)throw Error();}catch{console.error('Falta un medio requerido:',file);failed=true;}}
for(const file of [c.assets.vsl,'/assets/fuentes/inter-var.woff2'])try{await stat(path.join(root,file));}catch{console.log('Pendiente del cliente:',file);}
if(c.pendingCase && !c.pendingCase.enabled)console.log('Caso Daniel pendiente de identificar; permanece oculto.');
if(failed)process.exitCode=1;else console.log('Medios incluidos: rutas correctas y archivos no vacíos.');
