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

  const row = await getUserByEmail(email);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  if (row.email_verified !== 1) {
    return NextResponse.json(
      {
        error: "Please verify your email address before signing in. Check your inbox for the link we sent you.",
        unverified: true,
      },
      { status: 403 }
    );
  }

  const { token, expiresAt } = await createSessionToken(row.id);
  const res = NextResponse.json({ user: toSessionUser(row) });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return res;
}
