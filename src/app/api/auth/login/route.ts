import { NextResponse } from "next/server";
import {
  createSessionToken,
  getUserByEmail,
  SESSION_COOKIE,
  sessionCookieOptions,
  toSessionUser,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const row = getUserByEmail(email);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const { token, expiresAt } = createSessionToken(row.id);
  const res = NextResponse.json({ user: toSessionUser(row) });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return res;
}
