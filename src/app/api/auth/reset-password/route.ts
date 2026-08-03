import { NextResponse } from "next/server";
import {
  deleteAllSessionsForUser,
  hashPassword,
  updateUserPassword,
} from "@/lib/auth";
import { consumePasswordResetToken, deletePasswordResetTokensForUser } from "@/lib/reset";

export async function POST(req: Request) {
  let body: { token?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token, password } = body;
  if (typeof token !== "string" || !token) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const userId = consumePasswordResetToken(token);
  if (!userId) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  updateUserPassword(userId, passwordHash);
  deleteAllSessionsForUser(userId);
  deletePasswordResetTokensForUser(userId);

  return NextResponse.json({ ok: true });
}
