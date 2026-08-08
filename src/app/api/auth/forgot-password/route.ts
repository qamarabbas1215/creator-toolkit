import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { generateResetOtp } from "@/lib/reset";
import { isEmailConfigured, sendPasswordResetOtp } from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const user = getUserByEmail(normalized);

  if (user) {
    const otp = generateResetOtp(user.id);
    try {
      await sendPasswordResetOtp(normalized, otp);
    } catch {
      return NextResponse.json({ ok: true });
    }
    if (process.env.NODE_ENV !== "production" && !isEmailConfigured()) {
      return NextResponse.json({ ok: true, devOtp: otp });
    }
  }

  return NextResponse.json({ ok: true });
}
