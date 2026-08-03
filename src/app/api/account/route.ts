import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  clearSessionCookieOptions,
  deleteSessionToken,
  getCurrentUser,
  SESSION_COOKIE,
  toSessionUser,
  updateUserProfile,
} from "@/lib/auth";
import { cookies } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { name?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fields: { name?: string; email?: string } = {};
  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Name must be between 1 and 80 characters." }, { status: 400 });
    }
    fields.name = name;
  }
  if (body.email !== undefined) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const clash = db
      .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get(email, user.id);
    if (clash) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    fields.email = email;
  }

  const updated = updateUserProfile(user.id, fields);
  if (!updated) {
    return NextResponse.json({ error: "Could not update the account." }, { status: 500 });
  }
  return NextResponse.json({ user: toSessionUser(updated) });
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) deleteSessionToken(token);

  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());
  return res;
}
