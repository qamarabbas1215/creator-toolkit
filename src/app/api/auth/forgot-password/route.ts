import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth";
import { createPasswordResetToken } from "@/lib/reset";
import { sendPasswordResetEmail } from "@/lib/mail";

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
    const token = createPasswordResetToken(user.id);
    const origin = new URL(req.url).origin;
    const resetUrl = new URL("/reset-password", origin);
    resetUrl.searchParams.set("token", token);
    await sendPasswordResetEmail(normalized, resetUrl.toString());
  }

  return NextResponse.json({ ok: true });
}
