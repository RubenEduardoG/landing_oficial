create table if not exists public.bookings (
  booking_id uuid primary key,
  starts_at timestamptz,
  mode text not null check (mode in ('demo', 'calendly', 'calendly-embed')),
  data jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists bookings_unique_start
  on public.bookings (starts_at)
  where starts_at is not null;

create table if not exists public.leads (
  lead_id uuid primary key,
  booking_id uuid not null unique references public.bookings (booking_id),
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  token_hash text primary key,
  booking jsonb not null,
  qualification jsonb,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists sessions_expiration on public.sessions (expires_at);

create table if not exists public.deliveries (
  delivery_id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (lead_id),
  status text not null check (status in ('not-configured', 'delivered', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  client_hash text primary key,
  window_started_at timestamptz not null,
  attempts integer not null check (attempts >= 0)
);

alter table public.bookings enable row level security;
alter table public.leads enable row level security;
alter table public.sessions enable row level security;
alter table public.deliveries enable row level security;
alter table public.rate_limits enable row level security;

revoke all on table public.bookings, public.leads, public.sessions, public.deliveries, public.rate_limits
  from anon, authenticated;
grant select, insert, update, delete on table public.bookings, public.leads, public.sessions, public.deliveries, public.rate_limits
  to service_role;
grant usage, select on sequence public.deliveries_delivery_id_seq to service_role;

create or replace function public.bosco_consume_rate_limit(p_client_hash text, p_max_attempts integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  retry_seconds integer;
begin
  insert into public.rate_limits (client_hash, window_started_at, attempts)
  values (p_client_hash, now(), 1)
  on conflict (client_hash) do update
    set window_started_at = case
          when public.rate_limits.window_started_at <= now() - interval '1 minute' then now()
          else public.rate_limits.window_started_at
        end,
        attempts = case
          when public.rate_limits.window_started_at <= now() - interval '1 minute' then 1
          else public.rate_limits.attempts + 1
        end
  returning attempts, greatest(1, ceil(extract(epoch from (window_started_at + interval '1 minute' - now())))::integer)
  into current_count, retry_seconds;

  return jsonb_build_object(
    'allowed', current_count <= p_max_attempts,
    'retry_after', retry_seconds
  );
end;
$$;

revoke all on function public.bosco_consume_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.bosco_consume_rate_limit(text, integer) to service_role;

-- Run periodically from the Supabase SQL editor to remove expired transient rows.
-- delete from public.sessions where expires_at < now();
