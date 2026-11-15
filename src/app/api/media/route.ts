import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif"];

export const MEDIA_CATEGORIES = [
  "hero",
  "brand",
  "about",
  "programs",
  "trainers",
  "transformations",
  "general",
];

async function listStaticImages(): Promise<
  { title: string; alt: string; category: string; mimeType: string; size: number; url: string; source: "static" }[]
> {
  const root = path.join(process.cwd(), "public", "images");
  const results: {
    title: string;
    alt: string;
    category: string;
    mimeType: string;
    size: number;
    url: string;
    source: "static";
  }[] = [];

  async function walk(dir: string, category: string) {
    let entries: import("node:fs").Dirent[] = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, entry.name);
        continue;
      }
      if (!IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) continue;
      const stat = await fs.stat(full);
      const ext = path.extname(entry.name).replace(".", "").toLowerCase();
      results.push({
        title: entry.name,
        alt: entry.name.replace(/[-_]/g, " ").replace(path.extname(entry.name), ""),
        category: category === "images" ? "general" : category,
        mimeType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        size: stat.size,
        url: `/images/${path.relative(root, full).split(path.sep).join("/")}`,
        source: "static",
      });
    }
  }

  await walk(root, "images");
  return results.sort((a, b) => a.url.localeCompare(b.url));
}

export async function GET() {
  const staticImages = await listStaticImages();
  let uploads: {
    id: number;
    title: string;
    alt: string;
    category: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: string;
    source: "upload";
  }[] = [];

  try {
    const rows = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.id));
    uploads = rows.map((row) => ({
      id: row.id,
      title: row.title,
      alt: row.alt,
      category: row.category,
      mimeType: row.mimeType,
      size: row.size,
      url: `/api/media/${row.id}`,
      createdAt: row.createdAt.toISOString(),
      source: "upload" as const,
    }));
  } catch (error) {
    console.warn("[media] database unavailable:", (error as Error).message);
  }

  return NextResponse.json({ uploads, staticImages });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are supported" }, { status: 415 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Maximum upload size is 6 MB" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const title = String(form.get("title") ?? file.name);
  const alt = String(form.get("alt") ?? "");
  const category = String(form.get("category") ?? "general");

  try {
    const [row] = await db
      .insert(mediaAssets)
      .values({
        title,
        alt,
        category,
        mimeType: file.type,
        size: file.size,
        data: buffer.toString("base64"),
      })
      .returning();

    return NextResponse.json({
      ok: true,
      asset: {
        id: row.id,
        title: row.title,
        alt: row.alt,
        category: row.category,
        mimeType: row.mimeType,
        size: row.size,
        url: `/api/media/${row.id}`,
        createdAt: row.createdAt.toISOString(),
        source: "upload" as const,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
