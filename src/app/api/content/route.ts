import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { createDefaultContent } from "@/lib/content/defaults";
import { ensureContentShape } from "@/lib/content/merge";
import { getSiteContent, saveSiteContent } from "@/lib/content/repository";
import type { SiteContent } from "@/types/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const incoming = (body as { content?: SiteContent })?.content;
  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json({ error: "Missing content payload" }, { status: 400 });
  }

  const merged = ensureContentShape(incoming, createDefaultContent());
  const saved = await saveSiteContent(merged);
  return NextResponse.json({ content: saved, ok: true });
}
