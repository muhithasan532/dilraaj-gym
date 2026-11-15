import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { ADMIN_COOKIE, DEMO_PASSWORD } from "@/lib/config";

const SECRET = process.env.ADMIN_SESSION_SECRET ?? "dilraaj-demo-session-secret";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export function checkDemoPassword(input: string): boolean {
  return typeof input === "string" && input.trim() === DEMO_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
