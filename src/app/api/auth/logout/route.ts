import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  clearSessionCookieOptions,
  deleteSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await deleteSessionToken(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());
  return res;
}
