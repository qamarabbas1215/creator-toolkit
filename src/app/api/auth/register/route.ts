import { NextResponse } from "next/server";
import { queryRun, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { isEmailConfigured, sendVerificationEmail } from "@/lib/mail";
import { generateVerifyToken } from "@/lib/verify";
import { throttle } from "@/lib/rate-limit";
import { SITE_URL } from "@/data/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_MAX = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (name.length > 80) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const limited = await throttle("register", `email:${email}`, REGISTER_MAX, REGISTER_WINDOW_MS);
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: "Too many signups from this email. Try again later.",
        retryAfter: Math.ceil(limited.retryAfterMs / 1000),
      },
      { status: 429 }
    );
  }

  const existing = await queryOne("SELECT id FROM users WHERE email = ?", email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const createdAt = Date.now();
  const info = await queryRun(
    "INSERT INTO users (name, email, password_hash, plan, email_verified, created_at) VALUES (?, ?, ?, 'free', 0, ?) RETURNING id",
    name,
    email,
    passwordHash,
    createdAt
  );
  const id = info.lastInsertRowid;

  const token = await generateVerifyToken(id);
  let devLink: string | undefined;
  try {
    await sendVerificationEmail(email, name, token);
  } catch (err) {
    await queryRun("DELETE FROM users WHERE id = ?", id);
    console.error("[register] Verification email failed; account rolled back.", err);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "We couldn't send the verification email. Please try again." },
        { status: 500 }
      );
    }
  }
  if (process.env.NODE_ENV !== "production" && !isEmailConfigured()) {
    devLink = `${SITE_URL.replace(/\/$/, "")}/verify-email?token=${token}`;
  }

  return NextResponse.json(
    { ok: true, email, devLink },
    { status: 201 }
  );
}