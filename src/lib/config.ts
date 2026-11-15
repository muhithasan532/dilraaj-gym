import type { Locale } from "@/types/content";

export const DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD ?? "12345";

export const ADMIN_COOKIE = "dilraaj_admin_session";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "bn", label: "বাংলা", short: "বাং" },
];

export const LOCALE_STORAGE_KEY = "dilraaj-locale";
export const THEME_STORAGE_KEY = "dilraaj-theme";

export const PAGE_KEYS = ["home", "about", "transformation", "membership", "faq"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  home: "Home",
  about: "About Us",
  transformation: "Transformation",
  membership: "Membership",
  faq: "FAQ",
};
