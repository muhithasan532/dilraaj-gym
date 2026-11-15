import { eq } from "drizzle-orm";

import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { createDefaultContent } from "@/lib/content/defaults";
import { ensureContentShape } from "@/lib/content/merge";
import type { SiteContent } from "@/types/content";

const CONTENT_KEY = "site";

let memoryCache: { value: SiteContent; at: number } | null = null;

/** Repository interface — implemented today by Postgres, tomorrow by Supabase. */
export interface ContentRepository {
  load(): Promise<SiteContent>;
  save(content: SiteContent): Promise<SiteContent>;
}

class PostgresContentRepository implements ContentRepository {
  async load(): Promise<SiteContent> {
    const defaults = createDefaultContent();
    try {
      if (memoryCache && Date.now() - memoryCache.at < 1500) return memoryCache.value;
      const rows = await db.select().from(siteContent).where(eq(siteContent.key, CONTENT_KEY)).limit(1);
      const value = rows.length > 0 ? ensureContentShape(rows[0].data as unknown, defaults) : defaults;
      memoryCache = { value, at: Date.now() };
      return value;
    } catch (error) {
      console.warn("[content] falling back to default content:", (error as Error).message);
      return defaults;
    }
  }

  async save(content: SiteContent): Promise<SiteContent> {
    const payload: SiteContent = { ...content, updatedAt: new Date().toISOString() };
    await db
      .insert(siteContent)
      .values({ key: CONTENT_KEY, data: payload, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { data: payload, updatedAt: new Date() },
      });
    memoryCache = { value: payload, at: Date.now() };
    return payload;
  }
}

class StaticContentRepository implements ContentRepository {
  async load(): Promise<SiteContent> {
    return createDefaultContent();
  }
  async save(content: SiteContent): Promise<SiteContent> {
    return content;
  }
}

export const contentRepository: ContentRepository =
  process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
    ? new PostgresContentRepository()
    : new StaticContentRepository();

export async function getSiteContent(): Promise<SiteContent> {
  return contentRepository.load();
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  return contentRepository.save(content);
}
