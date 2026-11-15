<<<<<<< HEAD
# DilRaaj Gym & Fitness Centre — Website + Admin CMS

A premium, bilingual (English / বাংলা) multi-page website and fully editable demo CMS for
**DilRaaj Gym & Fitness Centre**, Rangpur, Bangladesh.

Read **[`CONTEXT.md`](./CONTEXT.md)** first — it documents the brand system, architecture, demo-data
status and every design decision.

---

## Quick start

```bash
npm install
npx drizzle-kit push      # create the content + media tables
npm run dev               # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

---

## Routes

### Public (exactly five)

| Route | Page |
| --- | --- |
| `/` | Home — hero, philosophy, programs, why, trainer, transformations, membership, schedule, testimonials, visit, CTA |
| `/about` | About Us — story, mission/vision, philosophy, facilities, coaching team, differentiators, CTA |
| `/transformation` | Transformation — featured stories, before/after sliders, categories, highlights, experiences, CTA |
| `/membership` | Membership — programs, plans, comparison, personal training, schedule, benefits, FAQ, CTA |
| `/faq` | FAQ — category filter, accordion, WhatsApp CTA |

There are **no** public routes for programs, trainers, contact, schedule, facilities, gallery,
classes or coaching — those live inside the five pages above.

### Admin

| Route | Purpose |
| --- | --- |
| `/admin` | Demo password login (`12345`) |
| `/admin/dashboard` | Content inventory, shortcuts, demo-content checklist |
| `/admin/settings` | Identity, contact, social, admin note |
| `/admin/homepage`, `/admin/pages` | Section-by-section editors (copy, buttons, images, items, SEO) |
| `/admin/programs` · `/admin/trainers` · `/admin/transformations` · `/admin/membership` · `/admin/schedule` · `/admin/faq` · `/admin/testimonials` | Collection CRUD, ordering, publish toggles |
| `/admin/media`, `/admin/media-key-assets` | Media library and hero asset paths |
| `/admin/header`, `/admin/footer`, `/admin/whatsapp`, `/admin/language`, `/admin/theme`, `/admin/seo` | Global modules |
| `/admin/backup` | Export / import JSON, reset demo content |

API: `/api/content`, `/api/auth`, `/api/media`, `/api/media/[id]`, `/api/health`.

---

## Admin demo password

```
12345
```

Override with `ADMIN_DEMO_PASSWORD` in `.env`.

> ⚠️ **This is not secure authentication.** It is a single shared password for the presentation
> build, checked on the server and stored in a signed HTTP-only cookie. For production, replace it
> with **Supabase Auth** (or equivalent) and enforce authorisation in the database with row-level
> security policies. `src/lib/auth.ts` and `/api/auth` are the only places that need to change.

---

## Bilingual system

Every editable field is a `LocalizedText` (`{ en, bn }`). Admin editors show **English and Bangla
side by side**; the public site switches instantly from the header language control and remembers
the choice in `localStorage`. Bengali typography uses **Hind Siliguri** and switches automatically
when `document.documentElement.lang = "bn"`.

---

## Media

* Bundled brand photography lives in `public/images/**` and is referenced by path.
* Images uploaded in the Media Library are stored in the demo PostgreSQL database and served from
  `/api/media/<id>`, so they persist across refreshes and restarts of this deployment.
* The hero has **two** assets (`media.heroDesktop`, `media.heroMobile`) rendered through a
  `<picture>` element. Replace them from Admin → *Media Library* without touching code.

See `CONTEXT.md §7` for the exact hero composition rules (desktop text-in-negative-space, mobile
text-first with the complete artwork below).

---

## Supabase readiness

The site runs with **no Supabase credentials**. The content layer is isolated behind a
`ContentRepository` interface, so moving to Supabase means adding one adapter:

```
src/lib/content/repository.ts   → load() / save()
docs/supabase-schema.sql        → target table design (site_content, pages, page_sections,
                                  programs, trainers, transformations, membership_plans,
                                  schedules, faqs, media_assets, social_links, localized_content)
```

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` when ready (see `.env.example`).
Never expose a service-role key to the browser.

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Documentation

* [`CONTEXT.md`](./CONTEXT.md) — architecture, brand, demo data, hero rules
* [`docs/supabase-schema.sql`](./docs/supabase-schema.sql) — future database schema
* [`.env.example`](./.env.example) — environment template
=======
# dilraaj-gym
>>>>>>> d8cacd2dda69298df499db3a3a46e33b70a1318c
