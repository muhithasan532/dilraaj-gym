-- ============================================================================
-- DilRaaj Gym & Fitness Centre — idempotent database schema
--
-- The app stores the whole editable CMS document in `site_content` (one JSONB
-- row, key = 'site') and uploaded binaries in `media_assets`.
-- This file is safe to run any number of times (CREATE ... IF NOT EXISTS), so it
-- doubles as the recovery step after a database reset:
--
--   npm run db:setup
--
-- It mirrors src/db/schema.ts — keep the two in sync when columns change, so
-- `npm run db:push` reports no pending changes.
-- ============================================================================

create table if not exists site_content (
  id          serial primary key,
  key         text not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  constraint site_content_key_unique unique (key)
);

create table if not exists media_assets (
  id          serial primary key,
  title       text not null default '',
  alt         text not null default '',
  category    text not null default 'general',
  mime_type   text not null default 'image/jpeg',
  size        integer not null default 0,
  data        text not null,
  created_at  timestamptz not null default now()
);

-- Databases created with `key text not null unique` ended up with the
-- Postgres-generated constraint name `site_content_key_key`; rename it to the
-- name Drizzle derives from src/db/schema.ts so both stay identical.
do $$
begin
  if exists (
        select 1 from pg_constraint
        where conname = 'site_content_key_key'
          and conrelid = 'site_content'::regclass
      )
      and not exists (
        select 1 from pg_constraint
        where conname = 'site_content_key_unique'
          and conrelid = 'site_content'::regclass
      )
  then
    alter table site_content rename constraint site_content_key_key to site_content_key_unique;
  end if;
end $$;
