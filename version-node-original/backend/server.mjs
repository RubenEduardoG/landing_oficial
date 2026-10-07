import http from 'node:http';
import {stat, realpath} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes, randomUUID} from 'node:crypto';
import {createStorage} from './storage.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(project, 'frontend');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.ico':'image/x-icon','.avif':'image/avif','.gif':'image/gif','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.vtt':'text/vtt; charset=utf-8','.m4v':'video/mp4','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
const HTTPS = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
};
export function slots(now = Date.now()) {
  const output = [];
  const day = new Date(now - 21600000).toISOString().slice(0, 10);
  for (let d = 0; d < 3; d++) for (let h = 9; h < 17; h++) {
    const time = Date.parse(`${day}T00:00:00-06:00`) + d * 86400000 + h * 3600000;
    if (time > now + 3600000 && time <= now + 172800000) output.push(new Date(time).toISOString());
  }
  return output;
}

function requestBody(req) {
  if (req.body !== undefined) {
    const value = Buffer.isBuffer(req.body) ? req.body.toString() : req.body;
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (Buffer.byteLength(serialized ?? '') > 8192) throw Object.assign(new Error('Datos demasiado extensos.'), {status: 413});
      return Promise.resolve(typeof value === 'string' ? JSON.parse(value) : value);
    } catch (error) {
      return Promise.reject(error.status ? error : Object.assign(new Error('Datos inválidos.'), {status: 400}));
    }
  }
  return (async () => {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8192) throw Object.assign(new Error('Datos demasiado extensos.'), {status: 413});
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      throw Object.assign(new Error('Datos inválidos.'), {status: 400});
    }
  })();
}

function sessionToken(req) {
  const cookie = req.headers.cookie || '';
  return cookie.split(';').map(value => value.trim()).find(value => value.startsWith('bosco_session='))?.slice(14) || '';
}

export function createHandler(options = {}) {
  const env = {...process.env, ...options.env};
  const externalFetch = options.fetch || fetch;
  const sessions = new Map();
  const localLimits = new Map();
  const dataDir = path.resolve(options.dataDir || env.DATA_DIR || path.join(project, 'backend/data'));
  const publicOrigin = env.PUBLIC_ORIGIN || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:5173');
  const originUrl = new URL(publicOrigin);
  const secure = env.VERCEL === '1' || originUrl.protocol === 'https:';
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(originUrl.hostname);
  const storage = createStorage({env, dataDir, fetchImpl: externalFetch, sessions});
  const requestedLimit = Number(env.LEAD_RATE_LIMIT);
  const maxAttempts = Number.isInteger(requestedLimit) && requestedLimit >= 1 && requestedLimit <= 100
    ? requestedLimit
    : (isLocal ? 30 : 10);
  const send = (res, status, data) => {
    res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
    res.end(JSON.stringify(data));
  };
  const fail = (message, status) => Object.assign(new Error(message), {status});

  return async function handle(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; frame-src https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
    try {
      const url = new URL(req.url, publicOrigin);
      const production = env.NODE_ENV === 'production' || env.VERCEL === '1';
      const demo = isLocal && !production && env.DEMO_BOOKING !== 'false';
      const ghlCalendarUrl = HTTPS(env.GHL_CALENDAR_URL || '');
      const sessionMode = ghlCalendarUrl ? 'ghl-embed' : demo ? 'demo' : 'pending';

      if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, {ok: true});
      if (req.method === 'GET' && url.pathname === '/api/config') {
        return send(res, 200, {
          ghlCalendarUrl,
          mode: sessionMode,
          resourcesUrl: HTTPS(env.RESOURCES_URL),
          storageReady: storage.configured
        });
      }
      if (req.method === 'GET' && url.pathname === '/api/session') {
        const token = sessionToken(req);
        const session = token ? await storage.getSession(token) : null;
        return send(res, 200, {booking: session?.booking || null, qualification: session?.qualification || null});
      }
      if (req.method === 'GET' && url.pathname === '/api/slots') {
        if (!demo || ghlCalendarUrl) return send(res, 409, {error: 'Agenda local no habilitada.'});
        const used = await storage.listBookings();
        return send(res, 200, {slots: slots().filter(value => !used.has(value))});
      }

      if (req.method === 'POST' && ['/api/bookings', '/api/qualification'].includes(url.pathname)) {
        const allowedOrigins = [publicOrigin, env.VERCEL_URL && `https://${env.VERCEL_URL}`].filter(Boolean);
        if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return send(res, 403, {error: 'Origen no permitido.'});
        if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, {error: 'Formato no permitido.'});

        const now = Date.now();
        const forwarded = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
        const ip = forwarded || req.socket?.remoteAddress || 'unknown';
        if (storage.persistent) {
          const result = await storage.consumeRateLimit(storage.rateLimitKey(ip), maxAttempts);
          if (!result.allowed) {
            const retryAfter = Math.max(1, Number(result.retry_after) || 60);
            res.setHeader('Retry-After', String(retryAfter));
            return send(res, 429, {error: 'Espera antes de volver a enviar.', retryAfter});
          }
        } else {
          for (const [key, value] of localLimits) if (value.expiry < now) localLimits.delete(key);
          for (const [key, value] of sessions) if (value.expiry < now) sessions.delete(key);
          const limit = localLimits.get(ip) || {count: 0, expiry: now + 60000};
          limit.count++;
          localLimits.set(ip, limit);
          if (limit.count > maxAttempts) {
            const retryAfter = Math.max(1, Math.ceil((limit.expiry - now) / 1000));
            res.setHeader('Retry-After', String(retryAfter));
            return send(res, 429, {error: 'Espera antes de volver a enviar.', retryAfter});
          }
        }

        const payload = await requestBody(req);
        if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.website) return send(res, 422, {error: 'Datos inválidos.'});
        if (url.pathname === '/api/bookings') {
          if (!demo || ghlCalendarUrl) {
            return send(res, 503, {error: 'La reserva debe confirmarse en GoHighLevel. La confirmación del calendario aún no está conectada al backend; no se creó ninguna reserva local.'});
          }
          if (!slots().includes(payload.slot)) return send(res, 422, {error: 'Elige un horario disponible en las próximas 48 horas.'});
          let booking = {id: randomUUID(), start: payload.slot, end: new Date(Date.parse(payload.slot) + 2700000).toISOString(), mode: 'demo', meetUrl: ''};
          booking = await storage.createDemoBooking(booking);
          if (!booking) return send(res, 409, {error: 'Ese horario acaba de reservarse. Elige otro.'});
          const token = randomBytes(32).toString('hex');
          const session = {expiry: now + 86400000, booking, qualification: null};
          await storage.saveSession(token, session);
          res.setHeader('Set-Cookie', `bosco_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure ? '; Secure' : ''}`);
          return send(res, 201, {ok: true, booking});
        }

        const token = sessionToken(req);
        const session = token ? await storage.getSession(token) : null;
        if (!session?.booking) return send(res, 409, {error: 'Primero elige y confirma tu horario.'});
        if (session.qualification) return send(res, 200, {ok: true, qualified: session.qualification.qualified});
        const {name, email, whatsapp, experience, goal, timeline, capital, monthly, decision} = payload;
        if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 || /[<>\x00-\x1f]/.test(name) ||
            typeof email !== 'string' || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
            typeof whatsapp !== 'string' || !/^\+?[\d ()-]{7,25}$/.test(whatsapp)) {
          return send(res, 422, {error: 'Revisa tu nombre, WhatsApp y correo electrónico.'});
        }
        const checks = {
          experience: ['experienced', 'first-time'],
          goal: ['income', 'family', 'diversify', 'bank'],
          timeline: ['30days', '2-3months', 'evaluating'],
          capital: ['under-250k', '250-500k', 'over-500k'],
          monthly: ['under-5k', '5-10k', 'over-10k'],
          decision: ['solo', 'partner', 'family']
        };
        for (const [key, values] of Object.entries(checks)) if (!values.includes(payload[key])) return send(res, 422, {error: 'Responde todas las preguntas.'});
        if (session.booking.email && session.booking.email.toLowerCase() !== email.trim().toLowerCase()) {
          return send(res, 422, {error: 'Usa el mismo email con el que reservaste tu sesión.'});
        }
        const qualified = timeline !== 'evaluating' && capital !== 'under-250k' && monthly !== 'under-5k';
        const lead = {
          id: randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), whatsapp, experience,
          goal, timeline, capital, monthly, decision, qualified, bookingId: session.booking.id,
          createdAt: new Date().toISOString(), source: 'bosco-landing'
        };
        await storage.saveLead(lead);
        session.qualification = {qualified, decision};
        await storage.saveSession(token, session);

        let delivery = 'not-configured';
        const webhook = HTTPS(env.GHL_LEAD_WEBHOOK_URL);
        if (webhook) {
          try {
            const response = await externalFetch(webhook, {
              method: 'POST',
              headers: {'Content-Type': 'application/json', ...(env.GHL_WEBHOOK_TOKEN ? {Authorization: `Bearer ${env.GHL_WEBHOOK_TOKEN}`} : {})},
              body: JSON.stringify({lead, booking: session.booking}),
              signal: AbortSignal.timeout(8000),
              redirect: 'error'
            });
            delivery = response.ok ? 'delivered' : 'failed';
          } catch {
            delivery = 'failed';
          }
        }
        await storage.saveDelivery({lead_id: lead.id, status: delivery, created_at: new Date().toISOString()});
        return send(res, 201, {ok: true, qualified});
      }

      if (url.pathname.startsWith('/api/')) return send(res, 404, {error: 'Ruta no encontrada.'});
      if (options.staticFiles === false) return send(res, 404, {error: 'Ruta no encontrada.'});
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return send(res, 405, {error: 'Método no permitido.'});
      }
      let route;
      try {
        route = decodeURIComponent(url.pathname);
      } catch {
        return send(res, 404, {error: 'Archivo no encontrado.'});
      }
      if (route.includes('\0') || route.includes('\\') || route.split('/').some(part => part.startsWith('.'))) return send(res, 404, {error: 'Archivo no encontrado.'});
      if (['/', '/landing', '/registro', '/calendar', '/gracias', '/no-apto', '/privacidad', '/terminos'].includes(route.replace(/\/$/, '') || '/')) route = '/index.html';
      const filename = path.resolve(root, `.${route}`);
      if (!filename.startsWith(root + path.sep)) return send(res, 404, {error: 'Archivo no encontrado.'});
      let info;
      let actual;
      try {
        actual = await realpath(filename);
        info = await stat(actual);
      } catch {
        return send(res, 404, {error: 'Archivo no encontrado.'});
      }
      if (!actual.startsWith(root + path.sep) || !info.isFile() || !types[path.extname(actual).toLowerCase()]) return send(res, 404, {error: 'Archivo no encontrado.'});
      const mime = types[path.extname(actual).toLowerCase()];
      const headers = {
        'Content-Type': mime, 'Accept-Ranges': 'bytes',
        'Cache-Control': /\.(html|json|js|css)$/.test(actual) ? 'no-cache' : 'public, max-age=3600'
      };
      let start = 0;
      let end = info.size - 1;
      let status = 200;
      if (req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!match || (!match[1] && !match[2])) {
          res.writeHead(416, {'Content-Range': `bytes */${info.size}`});
          return res.end();
        }
        if (!match[1]) start = Math.max(0, info.size - Number(match[2]));
        else {
          start = Number(match[1]);
          if (match[2]) end = Math.min(Number(match[2]), end);
        }
        if (start > end || start >= info.size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
          res.writeHead(416, {'Content-Range': `bytes */${info.size}`});
          return res.end();
        }
        status = 206;
        headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length'] = Math.max(0, end - start + 1);
      res.writeHead(status, headers);
      if (req.method === 'HEAD' || !info.size) return res.end();
      const stream = createReadStream(actual, {start, end});
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      if (res.headersSent) return res.destroy();
      const status = error.status || 500;
      send(res, status, {error: error.status ? error.message : 'No se pudo procesar la solicitud. Intenta nuevamente.'});
    }
  };
}

export function createApp(options = {}) {
  return http.createServer(createHandler(options));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 5173);
  const host = process.env.HOST || '127.0.0.1';
  createApp().listen(port, host, () => console.log(`BOSCO: http://${host === '127.0.0.1' ? 'localhost' : host}:${port}`));
}
