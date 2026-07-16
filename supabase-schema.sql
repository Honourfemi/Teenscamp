-- Run this entire file in Supabase's SQL Editor.
-- It creates the one table this app needs, and locks it down so that
-- only your server (using the secret service role key) can read or write it.

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique,
  full_name text not null,
  home_address text not null,
  phone_number text not null,
  email text not null,
  gender text not null,
  date_of_birth date not null,
  guardian_name text not null,
  guardian_phone text not null,
  emergency_contact text,
  church_or_school text,
  platoon text,
  payment_status text not null default 'pending',
  payment_reference text,
  amount numeric,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

-- Row Level Security: locked down completely. The app's server code uses
-- the SECRET service role key, which always bypasses these rules — so no
-- public policies are needed at all. This keeps registrant data private.
alter table participants enable row level security;
