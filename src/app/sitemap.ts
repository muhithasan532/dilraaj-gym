import type { MetadataRoute } from "next";

import { PAGE_KEYS } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["/", "/about", "/transformation", "/membership", "/faq"];

  // The five public routes, kept in sync with PAGE_KEYS.
  void PAGE_KEYS;

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.8,
    alternates: { languages: { en: `${base}${route}`, bn: `${base}${route}` } },
  }));
}
