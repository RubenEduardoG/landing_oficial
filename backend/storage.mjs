import {createHash} from 'node:crypto';
import {mkdir, appendFile, readFile} from 'node:fs/promises';
import path from 'node:path';

const hash = value => createHash('sha256').update(value).digest('hex');

async function appendJSONL(dir, file, value) {
  await mkdir(dir, {recursive: true, mode: 0o700});
  await appendFile(path.join(dir, file), JSON.stringify(value) + '\n', {mode: 0o600});
}

async function readJSONL(dir, file) {
  try {
    return (await readFile(path.join(dir, file), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export function createStorage({env, dataDir, fetchImpl = fetch, sessions}) {
  const production = env.NODE_ENV === 'production' || env.VERCEL === '1';
  let reservationQueue = Promise.resolve();
  const supabaseUrl = env.SUPABASE_URL || '';
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
  const configured = !production || (
    /^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(supabaseUrl) &&
    /^[\w.-]{20,}$/.test(serviceKey)
  );
  const unavailable = () => Object.assign(
    new Error('El almacenamiento persistente no está configurado. Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel y ejecuta el esquema SQL de Supabase. No se guardaron los datos.'),
    {status: 503}
  );

  async function request(table, {method = 'GET', query = '', body, prefer} = {}) {
    if (!configured) throw unavailable();
    let response;
    try {
      response = await fetchImpl(`${supabaseUrl}/rest/v1/${table}${query}`, {
        method,
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          ...(prefer ? {Prefer: prefer} : {})
        },
        ...(body === undefined ? {} : {body: JSON.stringify(body)}),
        signal: AbortSignal.timeout(8000)
      });
    } catch {
      throw Object.assign(new Error('No fue posible conectar con el almacenamiento persistente. No se guardaron los datos.'), {status: 503});
    }
    if (!response.ok) {
      const error = new Error(response.status === 409 && table === 'bookings'
        ? 'Ese horario acaba de reservarse. Elige otro.'
        : response.status === 409 && table === 'leads'
          ? 'Ya recibimos respuestas para esta reserva.'
        : 'No se pudo guardar o consultar la información. Intenta nuevamente.');
      error.status = response.status === 409 ? 409 : 503;
      throw error;
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return {
    configured,
    persistent: production,
    async listBookings() {
      if (production) {
        const earliest = encodeURIComponent(new Date().toISOString());
        const rows = await request('bookings', {query: `?select=starts_at&starts_at=gte.${earliest}`});
        return new Set(rows.map(row => row.starts_at).filter(Boolean).map(value => new Date(value).toISOString()));
      }
      return new Set((await readJSONL(dataDir, 'bookings.jsonl')).map(row => row.start));
    },
    async createBooking(booking) {
      if (production) {
        await request('bookings', {
          method: 'POST',
          body: {booking_id: booking.id, starts_at: booking.start, mode: booking.mode, data: booking}
        });
      } else if (booking.mode !== 'demo') {
        await appendJSONL(dataDir, 'bookings.jsonl', booking);
      }
    },
    async createDemoBooking(booking) {
      if (production) throw unavailable();
      const action = reservationQueue.then(async () => {
        const booked = await this.listBookings();
        if (booked.has(booking.start)) return null;
        await appendJSONL(dataDir, 'bookings.jsonl', booking);
        return booking;
      });
      reservationQueue = action.catch(() => {});
      return action;
    },
    async getSession(token) {
      if (production) {
        const rows = await request('sessions', {
          query: `?token_hash=eq.${hash(token)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=booking,qualification,expires_at`
        });
        if (!rows.length) return null;
        return {booking: rows[0].booking, qualification: rows[0].qualification, expiry: Date.parse(rows[0].expires_at)};
      }
      const session = sessions.get(token);
      return session && session.expiry > Date.now() ? session : null;
    },
    async saveSession(token, session) {
      if (production) {
        await request('sessions', {
          method: 'POST',
          query: '?on_conflict=token_hash',
          prefer: 'resolution=merge-duplicates,return=minimal',
          body: {
            token_hash: hash(token),
            booking: session.booking,
            qualification: session.qualification ?? null,
            expires_at: new Date(session.expiry).toISOString()
          }
        });
      } else {
        sessions.set(token, session);
      }
    },
    async saveLead(lead) {
      if (production) {
        await request('leads', {
          method: 'POST',
          body: {lead_id: lead.id, booking_id: lead.bookingId, data: lead}
        });
      } else {
        await appendJSONL(dataDir, 'leads.jsonl', lead);
      }
    },
    async saveDelivery(delivery) {
      if (production) {
        await request('deliveries', {method: 'POST', body: delivery});
      } else {
        await appendJSONL(dataDir, 'deliveries.jsonl', delivery);
      }
    },
    async consumeRateLimit(clientHash, maxAttempts) {
      if (!production) return null;
      const result = await request('rpc/bosco_consume_rate_limit', {
        method: 'POST',
        body: {p_client_hash: clientHash, p_max_attempts: maxAttempts}
      });
      return result;
    },
    rateLimitKey(ip) {
      return hash(`${serviceKey}:${ip}`);
    }
  };
}
