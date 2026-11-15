import { NextResponse } from "next/server";

import { ADMIN_COOKIE, DEMO_PASSWORD } from "@/lib/config";
import { checkDemoPassword, createSessionToken, isAuthenticated, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    authenticated: await isAuthenticated(),
    /** Indicates that this is the public demo gate, not production auth. */
    mode: "demo-password",
    passwordLength: DEMO_PASSWORD.length,
  });
}

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkDemoPassword(password)) {
    return NextResponse.json({ error: "Incorrect demo password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
