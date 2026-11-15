/**
 * DilRaaj Gym & Fitness Centre — Central content model.
 *
 * Every user-facing string is stored as a `LocalizedText` so the whole site can
 * switch between English and Bangla. The same shape is used by the demo
 * repository (PostgreSQL/Drizzle) and by the future Supabase adapter.
 */

export type Locale = "en" | "bn";

export interface LocalizedText {
  en: string;
  bn: string;
}

export interface MediaReference {
  /** Absolute path (`/images/...`) or `/api/media/<id>` for uploaded assets. */
  src: string;
  alt?: LocalizedText;
}

export interface SectionItem {
  id: string;
  title: LocalizedText;
  body?: LocalizedText;
  meta?: LocalizedText;
  value?: string;
  image?: string;
  href?: string;
  /** Simple string list rendered as bullet points (one entry per line in admin). */
  lines?: LocalizedText[];
}

export interface SectionContent {
  key: string;
  enabled: boolean;
  eyebrow?: LocalizedText;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  body?: LocalizedText;
  primaryCtaLabel?: LocalizedText;
  primaryCtaHref?: string;
  secondaryCtaLabel?: LocalizedText;
  secondaryCtaHref?: string;
  image?: string;
  imageMobile?: string;
  items?: SectionItem[];
  order: number;
}

export interface SeoSettings {
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  canonical: string;
  indexable: boolean;
}

export interface PageContent {
  key: string;
  published: boolean;
  seo: SeoSettings;
  sections: Record<string, SectionContent>;
}

export interface NavigationItem {
  id: string;
  label: LocalizedText;
  href: string;
  enabled: boolean;
  order: number;
}

export interface ThemeSettings {
  defaultMode: "dark" | "light";
  accent: string;
  accentSoft: string;
  darkBackground: string;
  darkSurface: string;
  darkCard: string;
  darkText: string;
  darkMuted: string;
  lightBackground: string;
  lightSurface: string;
  lightCard: string;
  lightText: string;
  lightMuted: string;
}

export interface WhatsAppSettings {
  /** Digits only, including country code, e.g. 8801XXXXXXXXX */
  number: string;
  floatingButtonEnabled: boolean;
  floatingLabel: LocalizedText;
  defaultMessage: LocalizedText;
  messages: {
    home: LocalizedText;
    membership: LocalizedText;
    personalTraining: LocalizedText;
    program: LocalizedText;
    transformation: LocalizedText;
    faq: LocalizedText;
  };
}

export interface HeaderSettings {
  logoImage: string;
  wordmark: string;
  showWordmark: boolean;
  nav: NavigationItem[];
  ctaLabel: LocalizedText;
  ctaHref: string;
  sticky: boolean;
}

export interface FooterSettings {
  tagline: LocalizedText;
  description: LocalizedText;
  infoHeading: LocalizedText;
  infoItems: SectionItem[];
  copyright: LocalizedText;
  showSocial: boolean;
}

export interface Program {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  category: LocalizedText;
  image: string;
  ctaMessage: LocalizedText;
  order: number;
  published: boolean;
}

export interface Trainer {
  id: string;
  name: LocalizedText;
  position: LocalizedText;
  bio: LocalizedText;
  specialization: LocalizedText;
  experience: LocalizedText;
  credentials: LocalizedText;
  achievements: LocalizedText;
  image: string;
  order: number;
  published: boolean;
}

export interface Transformation {
  id: string;
  name: LocalizedText;
  storyTitle: LocalizedText;
  goal: LocalizedText;
  duration: LocalizedText;
  body: LocalizedText;
  category: LocalizedText;
  beforeImage: string;
  afterImage: string;
  order: number;
  published: boolean;
}

export interface MembershipPlan {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: string;
  period: LocalizedText;
  duration: LocalizedText;
  sessions: LocalizedText;
  features: LocalizedText[];
  recommended: boolean;
  ctaMessage: LocalizedText;
  order: number;
  published: boolean;
}

export interface ScheduleEntry {
  id: string;
  day: LocalizedText;
  time: string;
  session: LocalizedText;
  trainer: LocalizedText;
  available: boolean;
  order: number;
  published: boolean;
}

export interface Faq {
  id: string;
  category: LocalizedText;
  question: LocalizedText;
  answer: LocalizedText;
  order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  quote: LocalizedText;
  order: number;
  published: boolean;
}

export interface MediaAssetMeta {
  id: number;
  title: string;
  alt: string;
  category: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  source: "upload" | "static";
  usage?: string;
}

/** The entire editable content document (stored as JSONB in `site_content`). */
export interface SiteContent {
  version: number;
  updatedAt: string;
  settings: {
    gymName: LocalizedText;
    shortName: string;
    tagline: LocalizedText;
    description: LocalizedText;
    logoImage: string;
    favicon: string;
    address: LocalizedText;
    city: LocalizedText;
    phone: string;
    email: string;
    whatsappNumber: string;
    mapsUrl: string;
    openingHours: LocalizedText;
    social: {
      facebook: string;
      instagram: string;
      youtube: string;
      tiktok: string;
    };
    demoNotice: LocalizedText;
    colors: ThemeSettings;
  };
  header: HeaderSettings;
  footer: FooterSettings;
  whatsapp: WhatsAppSettings;
  pages: Record<string, PageContent>;
  collections: {
    programs: Program[];
    trainers: Trainer[];
    transformations: Transformation[];
    plans: MembershipPlan[];
    schedule: ScheduleEntry[];
    faqs: Faq[];
    testimonials: Testimonial[];
  };
  media: {
    heroDesktop: string;
    heroMobile: string;
    logo: string;
    aboutHero: string;
  };
}

export interface ContentSnapshot {
  content: SiteContent;
  locale: Locale;
}
