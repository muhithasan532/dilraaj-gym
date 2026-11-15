"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { LOCALE_STORAGE_KEY, THEME_STORAGE_KEY } from "@/lib/config";
import { t as translate } from "@/lib/utils";
import { buildWhatsAppLink, type WhatsAppIntent } from "@/lib/whatsapp";
import type { Locale, LocalizedText, SiteContent } from "@/types/content";

interface SiteContextValue {
  content: SiteContent;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  t: (value: LocalizedText | null | undefined) => string;
  wa: (intent: WhatsAppIntent, options?: { message?: string; plan?: string; program?: string }) => string | null;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  const defaultMode: "dark" | "light" = content.settings.colors.defaultMode === "dark" ? "dark" : "light";
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setTheme] = useState<"dark" | "light">(defaultMode);

  /**
   * Adopt the visitor's saved choices once, on mount.
   *
   * This effect must never *write* to storage: the old code persisted `theme`
   * and `locale` from a `[theme]`/`[locale]` effect, so the very first render of
   * every page (which starts at the default mode) overwrote the visitor's choice
   * before their saved value was read — which is why light mode reverted to dark
   * as soon as you moved to another page.
   */
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : defaultMode;
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");

    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (storedLocale === "bn" || storedLocale === "en") {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
    }
  }, [defaultMode]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: "dark" | "light" = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }, [theme]);

  const t = useCallback((value: LocalizedText | null | undefined) => translate(value, locale), [locale]);

  const wa = useCallback(
    (intent: WhatsAppIntent, options?: { message?: string; plan?: string; program?: string }) =>
      buildWhatsAppLink(content.whatsapp, locale, { intent, ...options }),
    [content.whatsapp, locale],
  );

  const value = useMemo<SiteContextValue>(
    () => ({ content, locale, setLocale, theme, toggleTheme, t, wa }),
    [content, locale, setLocale, theme, toggleTheme, t, wa],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside <SiteProvider>");
  return context;
}
