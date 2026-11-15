import type { SectionContent, SiteContent } from "@/types/content";

export type FieldType =
  | "text"
  | "textarea"
  | "localized"
  | "localizedText"
  | "number"
  | "boolean"
  | "image"
  | "select"
  | "lines"
  | "color";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  demo?: boolean;
  rows?: number;
  hideInTable?: boolean;
}

export interface FieldGroup {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface CollectionConfig {
  key: "programs" | "trainers" | "transformations" | "plans" | "schedule" | "faqs" | "testimonials";
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  defaults: () => Record<string, unknown>;
}

export interface ModuleConfig {
  slug: string;
  title: string;
  icon: string;
  group: "Overview" | "Content" | "Collections" | "Global" | "System";
  kind: "settings" | "collection" | "pages" | "media" | "backup" | "dashboard";
  /** Dot path inside the content document for settings modules. */
  path?: string;
  groups?: FieldGroup[];
  collection?: CollectionConfig;
  pageKey?: string;
  description?: string;
}

const boolean = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "boolean", help });
const text = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: "text", ...extra });
const localized = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({
  key,
  label,
  type: "localized",
  ...extra,
});
const image = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "image", help });

export const COLLECTIONS: Record<string, CollectionConfig> = {
  programs: {
    key: "programs",
    title: "Programs",
    singular: "Program",
    description: "Training programs shown on the Home and Membership pages. No separate public route is created.",
    fields: [
      localized("title", "Program title", { demo: true }),
      localized("category", "Category", { demo: true }),
      localized("body", "Short description", { type: "localizedText" }),
      image("image", "Program image"),
      localized("ctaMessage", "WhatsApp CTA message", { type: "localizedText", demo: true }),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      title: { en: "New Program", bn: "নতুন প্রোগ্রাম" },
      category: { en: "General", bn: "সাধারণ" },
      body: { en: "", bn: "" },
      image: "/images/programs/strength.jpg",
      ctaMessage: { en: "Assalamu Alaikum. I would like to know more about this program.", bn: "আসসালামু আলাইকুম। এই প্রোগ্রাম সম্পর্কে বিস্তারিত জানতে চাই।" },
      published: true,
      order: 99,
    }),
  },
  trainers: {
    key: "trainers",
    title: "Trainers",
    singular: "Trainer",
    description: "Coaching profiles rendered on the About page and the Home featured-trainer section.",
    fields: [
      localized("name", "Name", { demo: true }),
      localized("position", "Position", { demo: true }),
      localized("bio", "Biography", { type: "localizedText" }),
      localized("specialization", "Specialisation", { demo: true }),
      localized("experience", "Experience", { demo: true }),
      localized("credentials", "Credentials", { demo: true }),
      localized("achievements", "Achievements", { demo: true }),
      image("image", "Profile photo"),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      name: { en: "New Trainer", bn: "নতুন ট্রেনার" },
      position: { en: "Fitness Coach", bn: "ফিটনেস কোচ" },
      bio: { en: "", bn: "" },
      specialization: { en: "", bn: "" },
      experience: { en: "", bn: "" },
      credentials: { en: "", bn: "" },
      achievements: { en: "", bn: "" },
      image: "/images/trainers/trainer-1.jpg",
      published: true,
      order: 99,
    }),
  },
  transformations: {
    key: "transformations",
    title: "Transformations",
    singular: "Story",
    description: "Before/after member stories. All entries are demo content until real members approve publication.",
    fields: [
      localized("name", "Member label", { demo: true }),
      localized("storyTitle", "Story title", { demo: true }),
      localized("goal", "Starting goal", { demo: true }),
      localized("duration", "Training duration", { demo: true }),
      localized("category", "Category", { demo: true }),
      localized("body", "Description", { type: "localizedText", demo: true }),
      image("beforeImage", "Before image"),
      image("afterImage", "After image"),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      name: { en: "Demo Member", bn: "ডেমো সদস্য" },
      storyTitle: { en: "New story", bn: "নতুন গল্প" },
      goal: { en: "", bn: "" },
      duration: { en: "3 months", bn: "৩ মাস" },
      category: { en: "Lifestyle", bn: "লাইফস্টাইল" },
      body: { en: "", bn: "" },
      beforeImage: "/images/transformations/story-1.jpg",
      afterImage: "/images/programs/strength.jpg",
      published: true,
      order: 99,
    }),
  },
  plans: {
    key: "plans",
    title: "Membership Plans",
    singular: "Plan",
    description: "Pricing cards. Mark one plan as recommended to highlight it on the website.",
    fields: [
      localized("name", "Plan name", { demo: true }),
      { key: "price", label: "Price (BDT number)", type: "text", demo: true, placeholder: "2500" },
      localized("period", "Price period", { demo: true }),
      localized("duration", "Membership duration", { demo: true }),
      localized("sessions", "Sessions", { demo: true }),
      localized("description", "Description", { type: "localizedText", demo: true }),
      { key: "features", label: "Features (one per line, use | to separate EN and BN)", type: "lines", demo: true, rows: 6 },
      boolean("recommended", "Recommended plan"),
      localized("ctaMessage", "WhatsApp CTA message", { type: "localizedText", demo: true }),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      name: { en: "New Plan", bn: "নতুন প্ল্যান" },
      description: { en: "", bn: "" },
      price: "2000",
      period: { en: "per month", bn: "প্রতি মাস" },
      duration: { en: "1 month membership", bn: "১ মাসের মেম্বারশিপ" },
      sessions: { en: "3 sessions per week", bn: "সপ্তাহে ৩টি সেশন" },
      features: [{ en: "Feature one", bn: "ফিচার এক" }],
      recommended: false,
      ctaMessage: { en: "Assalamu Alaikum. I am interested in this membership plan.", bn: "আসসালামু আলাইকুম। আমি এই মেম্বারশিপ প্ল্যানে আগ্রহী।" },
      published: true,
      order: 99,
    }),
  },
  schedule: {
    key: "schedule",
    title: "Schedule",
    singular: "Session",
    description: "Weekly timetable used on the Home preview and the Membership page.",
    fields: [
      localized("day", "Day", { demo: true }),
      { key: "time", label: "Time", type: "text", demo: true, placeholder: "06:00 – 07:30" },
      localized("session", "Session", { demo: true }),
      localized("trainer", "Trainer", { demo: true }),
      boolean("available", "Available"),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      day: { en: "Saturday", bn: "শনিবার" },
      time: "06:00 – 07:30",
      session: { en: "New session", bn: "নতুন সেশন" },
      trainer: { en: "", bn: "" },
      available: true,
      published: true,
      order: 99,
    }),
  },
  faqs: {
    key: "faqs",
    title: "FAQ",
    singular: "Question",
    description: "Questions grouped by category on the FAQ page (membership questions also appear on Membership).",
    fields: [
      localized("category", "Category", { demo: true }),
      localized("question", "Question", { demo: true }),
      localized("answer", "Answer", { type: "localizedText", demo: true }),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      category: { en: "General", bn: "সাধারণ" },
      question: { en: "New question?", bn: "নতুন প্রশ্ন?" },
      answer: { en: "", bn: "" },
      published: true,
      order: 99,
    }),
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    description: "Member quotes used on Home and the Transformation page. Marked as demo content by default.",
    fields: [
      localized("name", "Member label", { demo: true }),
      localized("role", "Role / duration", { demo: true }),
      localized("quote", "Quote", { type: "localizedText", demo: true }),
      boolean("published", "Published"),
      { key: "order", label: "Order", type: "number" },
    ],
    defaults: () => ({
      id: "",
      name: { en: "Demo — Member", bn: "ডেমো — সদস্য" },
      role: { en: "Member", bn: "সদস্য" },
      quote: { en: "", bn: "" },
      published: true,
      order: 99,
    }),
  },
};

const sectionFieldGroups = (pageKey: string): FieldGroup[] => {
  void pageKey;
  return [
    {
      title: "Section visibility",
      description: "Toggle a section off to remove it from the public page without deleting its content.",
      fields: [boolean("enabled", "Section enabled")],
    },
    {
      title: "Headings",
      fields: [
        localized("eyebrow", "Eyebrow"),
        localized("title", "Title"),
        localized("subtitle", "Subtitle"),
        localized("body", "Body copy", { type: "localizedText", rows: 6 }),
      ],
    },
    {
      title: "Buttons",
      fields: [
        localized("primaryCtaLabel", "Primary button label"),
        text("primaryCtaHref", "Primary button link"),
        localized("secondaryCtaLabel", "Secondary button label"),
        text("secondaryCtaHref", "Secondary button link"),
      ],
    },
    { title: "Media", fields: [image("image", "Section image"), image("imageMobile", "Mobile section image")] },
  ];
};

const seoGroups = (pageKey: string): FieldGroup[] => [
  {
    title: "SEO",
    description: "Per-page metadata used for search engines and social sharing.",
    fields: [
      localized("title", "SEO title"),
      localized("description", "Meta description", { type: "localizedText", rows: 4 }),
      image("image", "Social image"),
      text("canonical", "Canonical URL", { placeholder: `/${pageKey}` }),
      boolean("indexable", "Allow indexing"),
    ],
  },
];

export const MODULES: ModuleConfig[] = [
  { slug: "dashboard", title: "Dashboard", icon: "LayoutDashboard", group: "Overview", kind: "dashboard", description: "Content inventory and quick shortcuts." },
  {
    slug: "settings",
    title: "Website Settings",
    icon: "Settings",
    group: "Global",
    kind: "settings",
    path: "settings",
    description: "Business identity and contact details used across the whole website.",
    groups: [
      {
        title: "Identity",
        fields: [
          localized("gymName", "Gym name"),
          text("shortName", "Short name"),
          localized("tagline", "Tagline"),
          localized("description", "Website description", { type: "localizedText", rows: 4 }),
          image("logoImage", "Logo"),
          text("favicon", "Favicon path"),
        ],
      },
      {
        title: "Contact",
        fields: [
          localized("address", "Address", { demo: true }),
          localized("city", "City"),
          text("phone", "Phone", { demo: true }),
          text("email", "Email", { demo: true }),
          text("whatsappNumber", "WhatsApp number", { help: "Digits only with country code, e.g. 8801XXXXXXXXX", demo: true }),
          text("mapsUrl", "Google Maps URL"),
          localized("openingHours", "Opening hours", { demo: true }),
        ],
      },
      {
        title: "Social",
        fields: [
          text("social.facebook", "Facebook URL"),
          text("social.instagram", "Instagram URL"),
          text("social.youtube", "YouTube URL"),
          text("social.tiktok", "TikTok URL"),
        ],
      },
      {
        title: "Admin note",
        fields: [localized("demoNotice", "Demo content notice", { type: "localizedText", rows: 3 })],
      },
    ],
  },
  {
    slug: "homepage",
    title: "Homepage Editor",
    icon: "Home",
    group: "Content",
    kind: "pages",
    pageKey: "home",
    description: "Every homepage section, its copy, imagery and buttons.",
  },
  {
    slug: "pages",
    title: "Page Content",
    icon: "FileText",
    group: "Content",
    kind: "pages",
    pageKey: "about",
    description: "Editorial content for the four inner public pages.",
  },
  { slug: "programs", title: "Programs", icon: "Dumbbell", group: "Collections", kind: "collection", collection: COLLECTIONS.programs, description: COLLECTIONS.programs.description },
  { slug: "trainers", title: "Trainers", icon: "Users", group: "Collections", kind: "collection", collection: COLLECTIONS.trainers, description: COLLECTIONS.trainers.description },
  { slug: "transformations", title: "Transformations", icon: "Activity", group: "Collections", kind: "collection", collection: COLLECTIONS.transformations, description: COLLECTIONS.transformations.description },
  { slug: "membership", title: "Membership", icon: "CreditCard", group: "Collections", kind: "collection", collection: COLLECTIONS.plans, description: COLLECTIONS.plans.description },
  { slug: "schedule", title: "Schedule", icon: "CalendarDays", group: "Collections", kind: "collection", collection: COLLECTIONS.schedule, description: COLLECTIONS.schedule.description },
  { slug: "faq", title: "FAQ", icon: "HelpCircle", group: "Collections", kind: "collection", collection: COLLECTIONS.faqs, description: COLLECTIONS.faqs.description },
  { slug: "testimonials", title: "Testimonials", icon: "Quote", group: "Collections", kind: "collection", collection: COLLECTIONS.testimonials, description: COLLECTIONS.testimonials.description },
  {
    slug: "media",
    title: "Media Library",
    icon: "Image",
    group: "System",
    kind: "media",
    description: "Manage every image used by the website, including the hero artwork.",
  },
  {
    slug: "header",
    title: "Header & Navigation",
    icon: "PanelTop",
    group: "Global",
    kind: "settings",
    path: "header",
    description: "Logo, wordmark, navigation order and the header call-to-action.",
    groups: [
      {
        title: "Header",
        fields: [
          image("logoImage", "Logo"),
          text("wordmark", "Wordmark"),
          boolean("showWordmark", "Show wordmark"),
          boolean("sticky", "Sticky header"),
          localized("ctaLabel", "CTA label"),
          text("ctaHref", "CTA link"),
        ],
      },
    ],
  },
  {
    slug: "footer",
    title: "Footer",
    icon: "PanelBottom",
    group: "Global",
    kind: "settings",
    path: "footer",
    description: "Footer description, information links and copyright.",
    groups: [
      {
        title: "Footer",
        fields: [
          localized("tagline", "Tagline"),
          localized("description", "Description", { type: "localizedText", rows: 4 }),
          localized("infoHeading", "Information column heading"),
          localized("copyright", "Copyright"),
          boolean("showSocial", "Show social icons"),
        ],
      },
    ],
  },
  {
    slug: "whatsapp",
    title: "WhatsApp & Contact",
    icon: "MessageCircle",
    group: "Global",
    kind: "settings",
    path: "whatsapp",
    description: "Floating button, default messages and per-intent CTA templates.",
    groups: [
      {
        title: "Floating button",
        fields: [
          text("number", "WhatsApp number", { help: "Digits only, e.g. 8801XXXXXXXXX. Leave empty to disable outgoing links." }),
          boolean("floatingButtonEnabled", "Show floating button"),
          localized("floatingLabel", "Button label"),
          localized("defaultMessage", "Default message", { type: "localizedText", rows: 3 }),
        ],
      },
      {
        title: "Contextual messages",
        fields: [
          localized("messages.home", "Homepage message", { type: "localizedText" }),
          localized("messages.membership", "Membership message", { type: "localizedText" }),
          localized("messages.personalTraining", "Personal training message", { type: "localizedText" }),
          localized("messages.program", "Program message", { type: "localizedText" }),
          localized("messages.transformation", "Transformation message", { type: "localizedText" }),
          localized("messages.faq", "FAQ message", { type: "localizedText" }),
        ],
      },
    ],
  },
  {
    slug: "language",
    title: "Language Settings",
    icon: "Languages",
    group: "Global",
    kind: "settings",
    path: "settings",
    description: "Every field stores English and Bangla separately. Use this module to review both languages side by side.",
    groups: [
      {
        title: "Default language content",
        fields: [
          localized("gymName", "Gym name"),
          localized("tagline", "Tagline"),
          localized("description", "Description", { type: "localizedText", rows: 5 }),
          localized("address", "Address"),
          localized("openingHours", "Opening hours"),
        ],
      },
    ],
  },
  {
    slug: "theme",
    title: "Theme Settings",
    icon: "Palette",
    group: "Global",
    kind: "settings",
    path: "settings.colors",
    description: "Brand palette. Values are applied as CSS variables — keep contrast high to protect the design.",
    groups: [
      {
        title: "General",
        fields: [
          { key: "defaultMode", label: "Default mode", type: "select", options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }] },
          { key: "accent", label: "Primary accent", type: "color" },
          { key: "accentSoft", label: "Supporting red", type: "color" },
        ],
      },
      {
        title: "Dark theme",
        fields: [
          { key: "darkBackground", label: "Background", type: "color" },
          { key: "darkSurface", label: "Surface", type: "color" },
          { key: "darkCard", label: "Card", type: "color" },
          { key: "darkText", label: "Text", type: "color" },
          { key: "darkMuted", label: "Muted text", type: "color" },
        ],
      },
      {
        title: "Light theme",
        fields: [
          { key: "lightBackground", label: "Background", type: "color" },
          { key: "lightSurface", label: "Surface", type: "color" },
          { key: "lightCard", label: "Card", type: "color" },
          { key: "lightText", label: "Text", type: "color" },
          { key: "lightMuted", label: "Muted text", type: "color" },
        ],
      },
    ],
  },
  {
    slug: "seo",
    title: "SEO Settings",
    icon: "Search",
    group: "System",
    kind: "settings",
    path: "pages.home.seo",
    description: "Homepage metadata. Inner page SEO lives inside each page editor.",
    groups: seoGroups("home"),
  },
  {
    slug: "media-key-assets",
    title: "Key Image Paths",
    icon: "ImagePlay",
    group: "System",
    kind: "settings",
    path: "media",
    description: "Direct control over the hero artwork and other key image paths.",
    groups: [
      {
        title: "Hero assets",
        fields: [
          image("heroDesktop", "Desktop hero image"),
          image("heroMobile", "Mobile hero image"),
          image("logo", "Logo"),
          image("aboutHero", "About hero image"),
        ],
      },
    ],
  },
  { slug: "backup", title: "Backup & Restore", icon: "DatabaseBackup", group: "System", kind: "backup", description: "Export, import and reset the content document." },
];

export function findModule(slug: string): ModuleConfig | undefined {
  return MODULES.find((module) => module.slug === slug);
}

/** Section keys available in the page editors. */
export function sectionsForPage(content: SiteContent, pageKey: string): SectionContent[] {
  return Object.values(content.pages[pageKey]?.sections ?? {}).sort((a, b) => a.order - b.order);
}

export const PAGE_CHOICES = [
  { value: "home", label: "Home" },
  { value: "about", label: "About Us" },
  { value: "transformation", label: "Transformation" },
  { value: "membership", label: "Membership" },
  { value: "faq", label: "FAQ" },
];
