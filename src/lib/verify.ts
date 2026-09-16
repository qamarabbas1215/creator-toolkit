import { createHash, randomBytes } from "node:crypto";
import { queryRun, queryOne } from "@/lib/db";

export const VERIFY_EMAIL_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface VerifyRow {
  token_hash: string;
  user_id: number;
  created_at: number;
  expires_at: number;
}

export async function deleteVerifyTokensForUser(userId: number): Promise<void> {
  await queryRun("DELETE FROM email_verifications WHERE user_id = ?", userId);
}

export async function generateVerifyToken(userId: number): Promise<string> {
  await deleteVerifyTokensForUser(userId);
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  await queryRun(
    "INSERT INTO email_verifications (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    hashToken(token),
    userId,
    now,
    now + VERIFY_EMAIL_TTL_MS
  );
  return token;
}

export type ConsumeVerifyTokenResult =
  | { ok: true; userId: number; firstVerification: boolean }
  | { ok: false; reason: "invalid" | "expired" };

export async function consumeVerifyToken(token: string): Promise<ConsumeVerifyTokenResult> {
  const row = await queryOne<VerifyRow>(
    "SELECT token_hash, user_id, created_at, expires_at FROM email_verifications WHERE token_hash = ?",
    hashToken(token)
  );
  if (!row) return { ok: false, reason: "invalid" };

  await queryRun("DELETE FROM email_verifications WHERE token_hash = ?", row.token_hash);

  if (row.expires_at < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  const user = await queryOne<{ email_verified: number; email_verified_at: number | null }>(
    "SELECT email_verified, email_verified_at FROM users WHERE id = ?",
    row.user_id
  );
  if (!user) return { ok: false, reason: "invalid" };

  const firstVerification = user.email_verified !== 1;
  await queryRun(
    "UPDATE users SET email_verified = 1, email_verified_at = ? WHERE id = ?",
    Date.now(),
    row.user_id
  );

  return { ok: true, userId: row.user_id, firstVerification };
}

export async function isEmailVerified(userId: number): Promise<boolean> {
  const row = await queryOne<{ email_verified: number }>(
    "SELECT email_verified FROM users WHERE id = ?",
    userId
  );
  return row?.email_verified === 1;
}

export async function markEmailUnverified(userId: number): Promise<void> {
  await queryRun("UPDATE users SET email_verified = 0, email_verified_at = NULL WHERE id = ?", userId);
}