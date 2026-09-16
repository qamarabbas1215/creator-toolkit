import { NextResponse } from "next/server";
import {
  deleteAllSessionsForUser,
  getUserByEmail,
  hashPassword,
  updateUserPassword,
} from "@/lib/auth";
import { consumeResetOtp, deleteResetOtpsForUser } from "@/lib/reset";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_RE = /^\d{6}$/;

export async function POST(req: Request) {
  let body: { email?: unknown; otp?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, otp, password } = body;
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (typeof otp !== "string" || !OTP_RE.test(otp)) {
    return NextResponse.json(
      { error: "This code is invalid or has expired." },
      { status: 400 }
    );
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();
  const user = await getUserByEmail(normalized);
  if (!user) {
    return NextResponse.json(
      { error: "This code is invalid or has expired." },
      { status: 400 }
    );
  }

  const result = await consumeResetOtp(user.id, otp);
  if (!result.ok) {
    if (result.reason === "locked") {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Request a new code." },
        { status: 429 }
      );
    }
    if (result.reason === "expired") {
      return NextResponse.json(
        { error: "This code has expired. Request a new one." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "This code is invalid or has expired." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await updateUserPassword(user.id, passwordHash);
  await deleteAllSessionsForUser(user.id);
  await deleteResetOtpsForUser(user.id);

  return NextResponse.json({ ok: true });
}
