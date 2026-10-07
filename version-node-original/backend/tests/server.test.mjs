import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createApp,createHandler,slots} from '../server.mjs';

async function setup(env={},fetchImpl=fetch) {
  const dir=await mkdtemp(path.join(os.tmpdir(),'bosco-'));
  const server=createApp({dataDir:dir,env:{PUBLIC_ORIGIN:'http://localhost:5173',NODE_ENV:'development',GHL_CALENDAR_URL:'',GHL_LEAD_WEBHOOK_URL:'',...env},fetch:fetchImpl});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  return {dir,base,close:async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}};
}

const payload={
  name:'Persona de prueba',email:'persona@example.com',whatsapp:'+52 999 123 4567',
  experience:'first-time',goal:'bank',timeline:'30days',capital:'250-500k',monthly:'5-10k',decision:'solo'
};
const post=(base,route,body,cookie)=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});
async function booking(app) {
  const response=await post(app.base,'/api/bookings',{slot:slots()[0]});
  assert.equal(response.status,201);
  return response.headers.get('set-cookie').split(';')[0];
}

test('landing pública y rutas, sin gate; datos privados inaccesibles',async()=>{
  const app=await setup();
  try {
    for(const route of ['/','/registro','/gracias','/no-apto','/privacidad','/terminos']) {
      const response=await fetch(app.base+route);
      assert.equal(response.status,200);
      assert.match(await response.text(),/BOSCO/);
    }
    for(const route of ['/backend/data/leads.jsonl','/.env','/assets/..%5C.env']) assert.equal((await fetch(app.base+route)).status,404);
  } finally {await app.close();}
});

test('MP4 acepta HEAD y rangos válidos y rechaza rangos inválidos',async()=>{
  const app=await setup();
  try {
    const url=app.base+'/assets/videos/francelia.mp4';
    const head=await fetch(url,{method:'HEAD'});
    assert.equal(head.status,200);
    assert.equal(head.headers.get('content-type'),'video/mp4');
    const partial=await fetch(url,{headers:{Range:'bytes=0-99'}});
    assert.equal(partial.status,206);
    assert.equal((await partial.arrayBuffer()).byteLength,100);
    const suffix=await fetch(url,{headers:{Range:'bytes=-20'}});
    assert.equal((await suffix.arrayBuffer()).byteLength,20);
    assert.equal((await fetch(url,{headers:{Range:'bytes=999999999-'}})).status,416);
    assert.equal((await fetch(url,{headers:{Range:'bytes=-0'}})).status,416);
  } finally {await app.close();}
});

test('slots solo próximas 48h y sin reserva duplicada concurrente',async()=>{
  const app=await setup();
  try {
    const now=Date.now();
    assert.ok(slots(now).every(value=>Date.parse(value)>now&&Date.parse(value)<=now+172800000));
    const responses=await Promise.all([post(app.base,'/api/bookings',{slot:slots()[0]}),post(app.base,'/api/bookings',{slot:slots()[0]})]);
    assert.deepEqual(responses.map(response=>response.status).sort(),[201,409]);
    assert.equal((await post(app.base,'/api/bookings',{slot:new Date(now+3*86400000).toISOString()})).status,422);
  } finally {await app.close();}
});

test('agenda antes de preguntas; valida y guarda todos los campos nuevos',async()=>{
  const app=await setup();
  try {
    assert.equal((await post(app.base,'/api/qualification',payload)).status,409);
    const cookie=await booking(app);
    const response=await post(app.base,'/api/qualification',payload,cookie);
    assert.equal(response.status,201);
    assert.equal((await response.json()).qualified,true);
    const session=await fetch(app.base+'/api/session',{headers:{Cookie:cookie}}).then(value=>value.json());
    assert.deepEqual(session.qualification,{qualified:true,decision:'solo'});
    const saved=JSON.parse((await readFile(path.join(app.dir,'leads.jsonl'),'utf8')).trim());
    assert.equal(saved.email,payload.email);
    assert.equal(saved.experience,payload.experience);
    assert.equal(saved.goal,payload.goal);
    assert.equal(saved.timeline,payload.timeline);
    assert.equal(saved.capital,payload.capital);
    assert.equal(saved.monthly,payload.monthly);
    assert.equal(saved.decision,payload.decision);
    assert.equal('mexico' in saved,false);
    assert.equal('identification' in saved,false);
    assert.equal(saved.qualified,true);
    assert.ok(saved.bookingId);
    assert.equal((await post(app.base,'/api/qualification',payload,cookie)).status,200);
    assert.equal((await readFile(path.join(app.dir,'leads.jsonl'),'utf8')).trim().split('\n').length,1);
  } finally {await app.close();}
});

for(const [key,value] of [['timeline','evaluating'],['capital','under-250k'],['monthly','under-5k']]) {
  test(`único filtro No apto: ${key}`,async()=>{
    const app=await setup();
    try {
      const cookie=await booking(app);
      const response=await post(app.base,'/api/qualification',{...payload,[key]:value},cookie);
      assert.equal(response.status,201);
      assert.equal((await response.json()).qualified,false);
      const session=await fetch(app.base+'/api/session',{headers:{Cookie:cookie}}).then(result=>result.json());
      assert.ok(session.booking);
    } finally {await app.close();}
  });
}

test('experiencia, objetivo y decisión no agregan filtros de descalificación',async()=>{
  const app=await setup();
  try {
    const cookie=await booking(app);
    const response=await post(app.base,'/api/qualification',{...payload,experience:'experienced',goal:'family',decision:'partner'},cookie);
    assert.equal(response.status,201);
    assert.equal((await response.json()).qualified,true);
  } finally {await app.close();}
});

test('validación campos obligatorios, opciones, formato y origen',async()=>{
  const app=await setup();
  try {
    const cookie=await booking(app);
    for(const change of [{email:'incorrecto'},{goal:'inventado'},{decision:'otro'},{monthly:undefined},{name:'<script>'}]) {
      assert.equal((await post(app.base,'/api/qualification',{...payload,...change},cookie)).status,422);
    }
    const response=await fetch(app.base+'/api/qualification',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://otro.example',Cookie:cookie},body:JSON.stringify(payload)});
    assert.equal(response.status,403);
  } finally {await app.close();}
});

test('producción bloquea demo y confirma agenda GHL como pendiente de verificación',async()=>{
  const app=await setup({NODE_ENV:'production',DEMO_BOOKING:'true',GHL_CALENDAR_URL:'https://calendar.example/embed',SUPABASE_URL:'https://project.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'service-role-key-long-enough-for-tests'},async()=>new Response(JSON.stringify({allowed:true,retry_after:60}),{status:200}));
  try {
    const config=await fetch(app.base+'/api/config').then(response=>response.json());
    assert.equal(config.mode,'ghl-embed');
    assert.equal(config.ghlCalendarUrl,'https://calendar.example/embed');
    assert.equal((await fetch(app.base+'/api/slots')).status,409);
    const response=await post(app.base,'/api/bookings',{event:'scheduled'});
    assert.equal(response.status,503);
    assert.match((await response.json()).error,/aún no está conectada/);
  } finally {await app.close();}
});

test('URL no HTTPS no activa agenda GHL y producción sin storage falla explícitamente',async()=>{
  const app=await setup({NODE_ENV:'production',GHL_CALENDAR_URL:'http://calendar.example/embed'});
  try {
    const config=await fetch(app.base+'/api/config').then(response=>response.json());
    assert.equal(config.mode,'pending');
    assert.equal(config.ghlCalendarUrl,'');
    assert.equal(config.storageReady,false);
    const response=await post(app.base,'/api/bookings',{slot:slots()[0]});
    assert.equal(response.status,503);
    assert.match((await response.json()).error,/No se guardaron los datos/);
  } finally {await app.close();}
});

test('límite de envíos devuelve Retry-After sin exponer secretos',async()=>{
  const app=await setup({LEAD_RATE_LIMIT:'1',GHL_WEBHOOK_TOKEN:'secreto'});
  try {
    await post(app.base,'/api/bookings',{});
    const limited=await post(app.base,'/api/bookings',{});
    assert.equal(limited.status,429);
    assert.ok(Number(limited.headers.get('retry-after'))>0);
    assert.doesNotMatch(await fetch(app.base+'/api/config').then(response=>response.text()),/secreto/);
  } finally {await app.close();}
});

test('producción persiste datos de calificación en Supabase sin inventar la reserva',async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'bosco-supabase-'));
  const writes=[];
  const token='test-session-token';
  let storedSession={booking:{id:'verified-ghl-booking',mode:'ghl',email:payload.email,start:'2030-01-01T12:00:00Z'},qualification:null,expires_at:new Date(Date.now()+86400000).toISOString()};
  const server=createApp({
    dataDir:dir,
    env:{PUBLIC_ORIGIN:'https://bosco.example',NODE_ENV:'production',SUPABASE_URL:'https://project.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'service-role-key-long-enough-for-tests'},
    fetch:async(url,options={})=>{
      const address=String(url);
      if(address.includes('/rest/v1/rpc/')) return new Response(JSON.stringify({allowed:true,retry_after:60}),{status:200});
      if(address.includes('/rest/v1/sessions?')&&options.method!=='POST') return new Response(JSON.stringify([storedSession]),{status:200});
      if(address.includes('/rest/v1/')) {
        const body=options.body?JSON.parse(options.body):null;
        writes.push({url:address,body,headers:options.headers});
        if(address.includes('/sessions?on_conflict=')) storedSession={booking:body.booking,qualification:body.qualification,expires_at:body.expires_at};
        return new Response(null,{status:201});
      }
      throw new Error(`Unexpected external request: ${address}`);
    }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    const response=await post(base,'/api/qualification',payload,`bosco_session=${token}`);
    assert.equal(response.status,201);
    const session=await fetch(base+'/api/session',{headers:{Cookie:`bosco_session=${token}`}}).then(value=>value.json());
    assert.deepEqual(session.qualification,{qualified:true,decision:'solo'});
    const leadWrite=writes.find(write=>write.url.includes('/leads'));
    assert.equal(leadWrite.body.data.goal,payload.goal);
    assert.equal(leadWrite.body.data.decision,'solo');
    assert.ok(writes.some(write=>write.url.includes('/sessions?on_conflict=')));
    assert.ok(writes.every(write=>write.headers.apikey==='service-role-key-long-enough-for-tests'));
    await assert.rejects(readFile(path.join(dir,'leads.jsonl')),{code:'ENOENT'});
  } finally {
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
    await rm(dir,{recursive:true,force:true});
  }
});

test('límite de 8 KB también se aplica al body ya parseado por Vercel',async()=>{
  const handler=createHandler({env:{PUBLIC_ORIGIN:'http://localhost:5173'}});
  let status;
  const response={setHeader(){},writeHead(value){status=value;},end(){}};
  await handler({method:'POST',url:'/api/bookings',headers:{origin:'http://localhost:5173','content-type':'application/json'},body:{extra:'x'.repeat(9000)},socket:{remoteAddress:'127.0.0.1'}},response);
  assert.equal(status,413);
});
