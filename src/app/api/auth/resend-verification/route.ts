import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { isEmailConfigured, sendVerificationEmail } from "@/lib/mail";
import { generateVerifyToken, deleteVerifyTokensForUser } from "@/lib/verify";
import { throttle } from "@/lib/rate-limit";
import { SITE_URL } from "@/data/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_MAX = 3;
const RESEND_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const limited = await throttle("resend-verify", `email:${email}`, RESEND_MAX, RESEND_WINDOW_MS);
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Try again later.",
        retryAfter: Math.ceil(limited.retryAfterMs / 1000),
      },
      { status: 429 }
    );
  }

  const user = await getUserByEmail(email);
  let devLink: string | undefined;
  if (user && user.email_verified !== 1) {
    await deleteVerifyTokensForUser(user.id);
    const token = await generateVerifyToken(user.id);
    try {
      await sendVerificationEmail(email, user.name, token);
    } catch (err) {
      console.error("[resend-verify] Failed to send email.", err);
    }
    if (process.env.NODE_ENV !== "production" && !isEmailConfigured()) {
      devLink = `${SITE_URL.replace(/\/$/, "")}/verify-email?token=${token}`;
    }
  }

  return NextResponse.json({ ok: true, devLink });
}