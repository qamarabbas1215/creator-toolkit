import { NextResponse } from "next/server";
import {
  createSessionToken,
  getUserById,
  SESSION_COOKIE,
  sessionCookieOptions,
  toSessionUser,
} from "@/lib/auth";
import { consumeVerifyToken } from "@/lib/verify";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(request: Request) {
  let body: { token?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (!token) {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const result = await consumeVerifyToken(token);
  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "expired"
            ? "This verification link has expired. Request a new one."
            : "This verification link is invalid or has already been used.",
        invalid: true,
      },
      { status: 400 }
    );
  }

  const row = await getUserById(result.userId);
  if (!row) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const { token: sessionToken, expiresAt } = await createSessionToken(row.id);
  const res = NextResponse.json({ ok: true, user: toSessionUser(row) });
  res.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions(expiresAt));

  if (result.firstVerification) {
    try {
      await sendWelcomeEmail(row.email, row.name);
    } catch (err) {
      console.error("[verify] Welcome email failed.", err);
    }
  }

  return res;
}