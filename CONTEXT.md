# CONTEXT.md — DilRaaj Gym & Fitness Centre

> **দিলরাজ জিম অ্যান্ড ফিটনেস সেন্টার · রংপুর, বাংলাদেশ**
> Premium bilingual (English / বাংলা) fitness website + fully editable Admin CMS.
> This file is the single source of truth for the project's architecture, conventions and demo-data status.

---

## 1. What this project is

A production-structured **Next.js (App Router) + TypeScript + Tailwind CSS v4** website for
**DilRaaj Gym & Fitness Centre**, Rangpur, Bangladesh, containing:

* **Exactly five public pages** — `/`, `/about`, `/transformation`, `/membership`, `/faq`
* A **fully functional Admin CMS** at `/admin` (demo password `12345`)
* **Bilingual content** — every editable field stores English *and* Bangla
* **Light & dark themes** — dark is the default, preference is remembered
* **Floating WhatsApp button** on every public page, driven by centrally managed settings
* **No contact form, no newsletter form, no unnecessary submission forms** — all enquiries go to WhatsApp

---

## 2. Brand system

| Token | Dark | Light |
| --- | --- | --- |
| Background | `#0D0D0D` | `#F7F4F0` |
| Surface | `#171717` | `#FFFFFF` |
| Card | `#202020` | `#F1EDE8` |
| Text | `#F6F3EF` | `#141414` |
| Muted | `#AAA6A1` | `#5C5852` |
| Accent (crimson) | `#B9272D` | `#B9272D` |
| Accent soft | `#D43B3F` | `#D43B3F` |

Roughly **85% black/neutral** and **15% red**. Red is used only for CTA, active navigation,
eyebrows, small highlights and section numbers.

Typography:

* Display / headings — **Oswald** (`--font-display`)
* Editorial accent — **DM Serif Display** (`--font-serif-display`)
* Body — **Inter** (`--font-sans`)
* Bangla — **Hind Siliguri** (`--font-bangla`), automatically applied to `html[lang="bn"]`

All tokens are CSS variables in `src/app/globals.css`; the Admin → *Theme Settings* module writes
`settings.colors.*` which is wired into the same variables.

---

## 3. Design references

| Reference | Used for |
| --- | --- |
| `https://mygymss.netlify.app/` | Primary design reference — header proportions, navigation typography, hero composition, scroll reveals |
| `https://rghscr.netlify.app/` | Multi-page architecture, shared layout, public/admin separation |
| `https://theclass.com/` | Premium editorial branding, photography treatment, whitespace |

Nothing was copied verbatim — the identity, palette, logo and content are DilRaaj-specific.

---

## 4. Project structure

```
public/images/            brand, hero, about, programs, trainers, transformations assets
src/app/                  routes (5 public pages + /admin + /api)
src/components/
  common/                 Reveal, Section/heading, buttons, accordion, page hero, social icons
  cards/                  program, trainer, plan, testimonial, transformation + compare slider
  layout/                 site shell, header, footer, floating WhatsApp
  providers/              SiteProvider (locale + theme + t() + wa())
  sections/               home / about / transformation / membership / faq section blocks
  admin/                  admin context, shell, editors, fields, media library, backup, dashboard
src/lib/
  admin/                  module + field config, dot-path helpers
  content/                default content document, deep merge, repository (Postgres adapter)
  auth.ts                 demo password gate (HMAC cookie)
  whatsapp.ts             wa.me link builder with intent templates
  config.ts, utils.ts
src/types/content.ts      every content type, all strings are LocalizedText
src/db/                   Drizzle schema + client
```

---

## 5. Content architecture

The entire editable website is **one JSON document** (`SiteContent`) stored in the
`site_content` table (key `site`, JSONB column `data`):

```
settings      gym identity, contact, social, demo notice, colour tokens
header        logo, wordmark, navigation items, CTA
footer        tagline, description, info links, copyright
whatsapp      number, floating button, default + contextual messages
pages         home | about | transformation | membership | faq  → seo + sections{}
collections   programs, trainers, transformations, plans, schedule, faqs, testimonials
media         heroDesktop, heroMobile, logo, aboutHero
```

Public pages are **server components** that read the document through
`getSiteContent()` (`src/lib/content/repository.ts`) and render from it. **No page copy is
hardcoded in JSX** — every string on the public site comes from this document.

The repository is an interface (`ContentRepository`) with two implementations:

* `PostgresContentRepository` — used whenever `DATABASE_URL` exists (default here)
* `StaticContentRepository` — fallback when no database is configured

A future **Supabase adapter** only has to implement `load()` / `save()`; no public page needs to
change. See `docs/supabase-schema.sql` for the target table design.

---

## 6. Admin CMS

`/admin` → demo password gate → `/admin/dashboard`.

Modules (sidebar):

| Group | Modules |
| --- | --- |
| Overview | Dashboard |
| Content | Homepage Editor, Page Content (About / Transformation / Membership / FAQ) |
| Collections | Programs, Trainers, Transformations, Membership, Schedule, FAQ, Testimonials |
| Global | Website Settings, Header & Navigation, Footer, WhatsApp & Contact, Language Settings, Theme Settings |
| System | Media Library, Key Image Paths, SEO Settings, Backup & Restore |

Everything is driven by declarative field configs in `src/lib/admin/config.ts`:

* `SettingsEditor` — generic settings forms bound to a dot-path in the document
* `CollectionEditor` — add / edit / delete / reorder / publish any collection
* `PageEditor` — per-page SEO, publish toggle, per-section enable + copy + buttons + media + items
* `MediaLibraryPanel` — upload, preview, replace, alt text, categories, delete
* `BackupPanel` — export JSON, import JSON, reset demo content

**Persistence:** press **Save changes** in the admin top bar → `PUT /api/content` → written to
PostgreSQL → public pages re-render (they are `force-dynamic`). Saved content survives refresh
and is visible on any device, because it is stored server-side rather than only in localStorage.
Browser `localStorage` is still used for the **theme** and **language** preference.

**Hero images are replaceable** from Admin → *Media Library* / *Key Image Paths* (`media.heroDesktop`,
`media.heroMobile`). The hero uses a `<picture>` element with a desktop and a mobile source.

---

## 7. Hero assets (important)

| Purpose | Path | Size |
| --- | --- | --- |
| Desktop hero | `public/images/hero/dilraaj-hero-desktop.webp` | 1920×1280 (3:2) |
| Mobile hero | `public/images/hero/dilraaj-hero-mobile.webp` | 1280×1920 (2:3) |

**Desktop:** the artwork fills the hero height, anchored right (`object-contain object-[right_center]`).
The athlete stays on the right and the site copy sits in the artwork's own left negative space,
blended with a `#0B0B0B` → transparent gradient plus a crimson ambient glow. The artwork is never
cropped or replaced.

**Mobile (Option A — text first):** eyebrow → headline → paragraph → CTA buttons → the complete
mobile artwork below the text at its natural aspect ratio with `object-contain`.
Nothing — head, raised fists, trophy or medal — is ever cut off.

> **Note:** the two files currently in the repository are AI-generated stand-ins that match the
> supplied composition (champion, trophy, medal, crimson haze, right-side athlete, left negative
> space). Replace them with the real DilRaaj photographs at exactly the same paths — no code change
> is required, and both paths remain editable from the Admin Media Library.

Subtle red treatment is applied with CSS overlays/ambient light only — no destructive filters,
no recoloured skin, no added badges or text.

---

## 8. Demo content status ⚠️

The whole site is intentionally filled with **polished illustrative demo content** so it can be
presented to the owner immediately. Items marked with a **“demo content”** badge in the Admin UI
must be replaced with confirmed business facts:

* Phone number, WhatsApp number, address, opening hours, email, social URLs
* Trainer names, positions, biographies, credentials and achievements
* Transformation stories (names, durations, results)
* Membership prices and benefit lists
* Testimonials
* Progress-highlight numbers on the Transformation page
* Progress-highlight numbers, "6 days a week / 3 plans / 1:1 coaching" hero stats

Fictional statements are **not** attributed to any real individual, and no review counts, ratings,
awards or verified location claims are published.

---

## 9. WhatsApp integration

`src/lib/whatsapp.ts` builds `https://wa.me/<number>?text=<message>` from `settings.whatsapp`.
Number formats: digits only, including country code, e.g. `8801XXXXXXXXX`.

Contextual intents: `home`, `membership`, `personalTraining`, `program`, `transformation`, `faq`.
Each has an editable EN + BN template in Admin → *WhatsApp & Contact*.

**When no number is configured the floating button still renders, but clicking it shows a notice
instead of opening an invalid destination.** Configure the number in Admin → *WhatsApp & Contact*.

---

## 10. Authentication (demo only)

`POST /api/auth` checks the password against `ADMIN_DEMO_PASSWORD` (default `12345`) and sets a
signed, HTTP-only session cookie (12 h). `/admin/*` is protected in `src/app/admin/layout.tsx`.

> This is **not** secure production authentication — it is a presentation gate. Production must use
> Supabase Auth (or equivalent) plus row-level-security policies, and the API routes should verify a
> real session instead of a demo secret.

---

## 11. Environment

`.env.example` documents every variable. The app runs with **all Supabase variables empty**.

```
DATABASE_URL=postgresql://...        # demo content store (already configured)
ADMIN_DEMO_PASSWORD=12345            # optional override
ADMIN_SESSION_SECRET=change-me       # cookie signing secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=            # future
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # future
```

Never place a Supabase service-role key in frontend code.

---

## 12. Commands

```bash
npm run dev        # local development
npm run build      # production build
npm run start      # production server
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npx drizzle-kit push   # apply the Drizzle schema
```

---

## 13. Acceptance checklist status

Public site: five routes ✓ · bilingual ✓ · light/dark ✓ · floating WhatsApp ✓ · no contact form ✓ ·
hero preserved on desktop and mobile ✓ · animations respect `prefers-reduced-motion` ✓.

Admin: login ✓ · dashboard ✓ · settings/pages/collections/FAQ/media/header/footer/WhatsApp/theme/SEO/backup
all editable ✓ · saved content survives refresh ✓ · export/import/reset ✓.

Known intentional limitations (documented, not bugs): demo password gate, demo media stored in the
demo database rather than object storage, and demo business data awaiting the owner's confirmation.
