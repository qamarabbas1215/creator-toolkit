import { NextResponse } from "next/server";
import { queryOne, queryRun } from "@/lib/db";
import {
  clearSessionCookieOptions,
  deleteAllSessionsForUser,
  deleteSessionToken,
  getCurrentUser,
  SESSION_COOKIE,
  toSessionUser,
  updateUserProfile,
  verifyPassword,
  getUserById,
} from "@/lib/auth";
import { generateVerifyToken, markEmailUnverified, deleteVerifyTokensForUser } from "@/lib/verify";
import { isEmailConfigured, sendVerificationEmail } from "@/lib/mail";
import { SITE_URL } from "@/data/site";
import { cookies } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fields: { name?: string; email?: string } = {};
  const emailChanged =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : undefined;

  if (emailChanged !== undefined && emailChanged !== user.email) {
    if (!EMAIL_RE.test(emailChanged)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const clash = await queryOne("SELECT id FROM users WHERE email = ? AND id != ?", emailChanged, user.id);
    if (clash) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Enter your current password to change your email." },
        { status: 400 }
      );
    }
    const fullRow = await getUserById(user.id);
    if (!fullRow || !(await verifyPassword(password, fullRow.password_hash))) {
      return NextResponse.json({ error: "Your password is incorrect." }, { status: 401 });
    }
    fields.email = emailChanged;
  }

  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Name must be between 1 and 80 characters." }, { status: 400 });
    }
    fields.name = name;
  }

  const updated = await updateUserProfile(user.id, fields);
  if (!updated) {
    return NextResponse.json({ error: "Could not update the account." }, { status: 500 });
  }

  let unverified = false;
  let devLink: string | undefined;
  if (fields.email) {
    await deleteVerifyTokensForUser(user.id);
    await markEmailUnverified(user.id);
    await deleteAllSessionsForUser(user.id);
    const token = await generateVerifyToken(user.id);
    try {
      await sendVerificationEmail(fields.email, updated.name, token);
    } catch (err) {
      console.error("[account] Verification email failed after email change.", err);
    }
    if (process.env.NODE_ENV !== "production" && !isEmailConfigured()) {
      devLink = `${SITE_URL.replace(/\/$/, "")}/verify-email?token=${token}`;
    }
    unverified = true;
  }

  const res = NextResponse.json({ user: toSessionUser(updated), unverified, devLink });
  if (unverified) {
    res.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());
  }
  return res;
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await deleteSessionToken(token);

  await queryRun("DELETE FROM users WHERE id = ?", user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());
  return res;
}