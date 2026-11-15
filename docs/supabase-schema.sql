-- ============================================================================
-- DilRaaj Gym & Fitness Centre — target database schema (Supabase / PostgreSQL)
--
-- The demo deployment stores the whole editable document in `site_content.data`
-- (JSONB) plus uploaded binaries in `media_assets`. This file documents the
-- normalised target shape for the Supabase migration so the public pages and
-- the admin editors can move across without redesign.
--
-- Row Level Security (RLS) sketches are included at the bottom.
-- ============================================================================

-- Single-row JSONB document (current demo storage) ---------------------------
create table if not exists site_content (
  id          bigserial primary key,
  key         text not null unique,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Normalised target tables ---------------------------------------------------
create table if not exists site_settings (
  id              bigserial primary key,
  gym_name_en     text not null,
  gym_name_bn     text not null,
  tagline_en      text,
  tagline_bn      text,
  description_en  text,
  description_bn  text,
  logo_path       text,
  favicon_path    text,
  address_en      text,
  address_bn      text,
  city_en         text,
  city_bn         text,
  phone           text,
  email           text,
  whatsapp_number text,
  maps_url        text,
  opening_hours_en text,
  opening_hours_bn text,
  theme           jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

create table if not exists pages (
  id          bigserial primary key,
  key         text not null unique,           -- home | about | transformation | membership | faq
  published   boolean not null default true,
  seo         jsonb not null default '{}'::jsonb
);

create table if not exists page_sections (
  id          bigserial primary key,
  page_key    text not null references pages(key) on delete cascade,
  section_key text not null,
  position    integer not null default 0,
  enabled     boolean not null default true,
  content     jsonb not null default '{}'::jsonb,  -- LocalizedText fields + CTAs + image refs
  unique (page_key, section_key)
);

create table if not exists navigation_items (
  id          bigserial primary key,
  scope       text not null default 'header',  -- header | footer
  label_en    text not null,
  label_bn    text not null,
  href        text not null,
  enabled     boolean not null default true,
  position    integer not null default 0
);

create table if not exists programs (
  id           bigserial primary key,
  slug         text not null unique,
  title_en     text not null,
  title_bn     text not null,
  category_en  text,
  category_bn  text,
  body_en      text,
  body_bn      text,
  image_path   text,
  cta_message_en text,
  cta_message_bn text,
  published    boolean not null default true,
  position     integer not null default 0
);

create table if not exists trainers (
  id              bigserial primary key,
  name_en         text not null,
  name_bn         text not null,
  position_en     text,
  position_bn     text,
  bio_en          text,
  bio_bn          text,
  specialization_en text,
  specialization_bn text,
  experience_en   text,
  experience_bn   text,
  credentials_en  text,
  credentials_bn  text,
  achievements_en text,
  achievements_bn text,
  image_path      text,
  published       boolean not null default true,
  position        integer not null default 0
);

create table if not exists transformations (
  id            bigserial primary key,
  member_en     text not null,
  member_bn     text not null,
  story_title_en text,
  story_title_bn text,
  goal_en       text,
  goal_bn       text,
  duration_en   text,
  duration_bn   text,
  category_en   text,
  category_bn   text,
  body_en       text,
  body_bn       text,
  before_image  text,
  after_image   text,
  published     boolean not null default true,
  position      integer not null default 0
);

create table if not exists membership_plans (
  id             bigserial primary key,
  name_en        text not null,
  name_bn        text not null,
  description_en text,
  description_bn text,
  price_bdt      integer not null default 0,
  period_en      text,
  period_bn      text,
  duration_en    text,
  duration_bn    text,
  sessions_en    text,
  sessions_bn    text,
  features       jsonb not null default '[]'::jsonb,  -- [{ en, bn }]
  recommended    boolean not null default false,
  cta_message_en text,
  cta_message_bn text,
  published      boolean not null default true,
  position       integer not null default 0
);

create table if not exists schedules (
  id          bigserial primary key,
  day_en      text not null,
  day_bn      text not null,
  time_range  text not null,
  session_en  text,
  session_bn  text,
  trainer_en  text,
  trainer_bn  text,
  available   boolean not null default true,
  published   boolean not null default true,
  position    integer not null default 0
);

create table if not exists faqs (
  id            bigserial primary key,
  category_en   text not null,
  category_bn   text not null,
  question_en   text not null,
  question_bn   text not null,
  answer_en     text not null,
  answer_bn     text not null,
  published     boolean not null default true,
  position      integer not null default 0
);

create table if not exists testimonials (
  id          bigserial primary key,
  name_en     text not null,
  name_bn     text not null,
  role_en     text,
  role_bn     text,
  quote_en    text not null,
  quote_bn    text not null,
  published   boolean not null default true,
  position    integer not null default 0
);

create table if not exists media_assets (
  id          bigserial primary key,
  bucket_path text not null,                 -- Supabase Storage object path
  title       text not null default '',
  alt         text not null default '',
  category    text not null default 'general',
  mime_type   text not null,
  size_bytes  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists social_links (
  id      bigserial primary key,
  network text not null,                     -- facebook | instagram | youtube | tiktok
  url     text not null,
  enabled boolean not null default true
);

-- Row Level Security sketches ------------------------------------------------
-- Public site reads through the anon key; only authenticated staff may write.
--
-- alter table programs enable row level security;
-- create policy "public read programs"   on programs for select using (published);
-- create policy "staff write programs"   on programs for all    using (auth.role() = 'authenticated');
--
-- Repeat the two policies for pages, page_sections, navigation_items, trainers,
-- transformations, membership_plans, schedules, faqs, testimonials, media_assets
-- and site_settings (site_settings has no `published` column, so restrict select
-- to authenticated users or expose a public view with only the safe columns).
--
-- Storage: bucket `media` with policies mirroring the media_assets rules.
