import { jsonb, pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * Demo content store.
 *
 * The whole editable content document lives in a single JSONB row so the
 * Admin CMS can read/write it atomically. When migrating to Supabase this maps
 * 1:1 to a `site_content` table (see docs/supabase-schema.sql).
 */
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Uploaded media for the demo Media Library.
 * Binary payloads are kept base64-encoded in the database so they survive
 * restarts and are servable through `/api/media/[id]`. In the Supabase version
 * these rows become `media_assets` entries pointing at Supabase Storage.
 */
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  alt: text("alt").notNull().default(""),
  category: text("category").notNull().default("general"),
  mimeType: text("mime_type").notNull().default("image/jpeg"),
  size: integer("size").notNull().default(0),
  data: text("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
