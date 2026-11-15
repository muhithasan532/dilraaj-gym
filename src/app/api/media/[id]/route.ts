import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const rows = await db.select().from(mediaAssets).where(eq(mediaAssets.id, numericId)).limit(1);
  if (rows.length === 0) return new NextResponse("Not found", { status: 404 });

  const asset = rows[0];
  const buffer = Buffer.from(asset.data, "base64");
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const numericId = Number(id);
  const body = (await request.json()) as { title?: string; alt?: string; category?: string };

  const [row] = await db
    .update(mediaAssets)
    .set({
      title: body.title ?? undefined,
      alt: body.alt ?? undefined,
      category: body.category ?? undefined,
    })
    .where(eq(mediaAssets.id, numericId))
    .returning();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(mediaAssets).where(eq(mediaAssets.id, Number(id)));
  return NextResponse.json({ ok: true });
}
