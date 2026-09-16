import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { generateResetOtp } from "@/lib/reset";
import { isEmailConfigured, sendPasswordResetOtp } from "@/lib/mail";
import { throttle } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORGOT_MAX = 3;
const FORGOT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  let email: unknown;
  try {
    const body = await req.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  const limited = await throttle("forgot-password", `email:${normalized}`, FORGOT_MAX, FORGOT_WINDOW_MS);
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Try again in a few minutes.",
        retryAfter: Math.ceil(limited.retryAfterMs / 1000),
      },
      { status: 429 }
    );
  }

  const user = await getUserByEmail(normalized);

  if (user) {
    const otp = await generateResetOtp(user.id);
    try {
      await sendPasswordResetOtp(normalized, otp);
    } catch (err) {
      console.error("[forgot-password] Failed to send password reset email", { email: normalized }, err);
      return NextResponse.json({ ok: true });
    }
    if (process.env.NODE_ENV !== "production" && !isEmailConfigured()) {
      return NextResponse.json({ ok: true, devOtp: otp });
    }
  }

  return NextResponse.json({ ok: true });
}