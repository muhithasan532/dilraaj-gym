import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LocalizedText, Locale } from "@/types/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pick the active locale from a localized value with a graceful fallback. */
export function t(value: LocalizedText | null | undefined, locale: Locale): string {
  if (!value) return "";
  const primary = value[locale];
  if (primary && primary.trim().length > 0) return primary;
  return value.en ?? "";
}

export function localized(value: string | undefined, locale: Locale): LocalizedText {
  return locale === "bn" ? { en: value ?? "", bn: value ?? "" } : { en: value ?? "", bn: value ?? "" };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatBdt(amount: string | number): string {
  const numeric = typeof amount === "number" ? amount : Number(String(amount).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric === 0) return String(amount);
  return `৳${numeric.toLocaleString("en-US")}`;
}

export function splitLines(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
