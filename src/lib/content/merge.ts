import type { SiteContent } from "@/types/content";

type AnyRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep merge a stored document over the shipped defaults.
 * Missing keys (for example a section added in a newer release) fall back to
 * the default so the public site can never render an empty page.
 */
export function mergeContent<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }

  const result: AnyRecord = { ...(base as AnyRecord) };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = (base as AnyRecord)[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      result[key] = mergeContent(current, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export function ensureContentShape(stored: unknown, defaults: SiteContent): SiteContent {
  const merged = mergeContent(defaults, stored);
  merged.updatedAt = (stored as Partial<SiteContent>)?.updatedAt ?? defaults.updatedAt;
  merged.version = (stored as Partial<SiteContent>)?.version ?? defaults.version;
  return merged;
}
