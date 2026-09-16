import { createHash, randomInt } from "node:crypto";
import { queryRun, queryOne } from "@/lib/db";

export const RESET_OTP_TTL_MS = 10 * 60 * 1000;
export const RESET_OTP_MAX_ATTEMPTS = 5;

export type ConsumeResetOtpResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "locked" };

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

interface ResetRow {
  token_hash: string;
  user_id: number;
  expires_at: number;
  attempts: number;
}

async function latestResetRow(userId: number): Promise<ResetRow | undefined> {
  return queryOne<ResetRow>(
    "SELECT token_hash, user_id, expires_at, attempts FROM password_resets WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1",
    userId
  );
}

async function clearResetRowsForUser(userId: number): Promise<void> {
  await queryRun("DELETE FROM password_resets WHERE user_id = ?", userId);
}

export async function generateResetOtp(userId: number): Promise<string> {
  await clearResetRowsForUser(userId);
  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = Date.now() + RESET_OTP_TTL_MS;
  await queryRun(
    "INSERT INTO password_resets (token_hash, user_id, expires_at, attempts) VALUES (?, ?, ?, 0)",
    hashOtp(otp),
    userId,
    expiresAt
  );
  return otp;
}

export async function consumeResetOtp(userId: number, otp: string): Promise<ConsumeResetOtpResult> {
  const row = await latestResetRow(userId);
  if (!row) return { ok: false, reason: "invalid" };

  if (row.expires_at < Date.now()) {
    await clearResetRowsForUser(userId);
    return { ok: false, reason: "expired" };
  }

  if (row.attempts >= RESET_OTP_MAX_ATTEMPTS) {
    await clearResetRowsForUser(userId);
    return { ok: false, reason: "locked" };
  }

  if (row.token_hash === hashOtp(otp)) {
    await clearResetRowsForUser(userId);
    return { ok: true };
  }

  const attempts = row.attempts + 1;
  await queryRun("UPDATE password_resets SET attempts = ? WHERE token_hash = ?", attempts, row.token_hash);
  if (attempts >= RESET_OTP_MAX_ATTEMPTS) {
    await clearResetRowsForUser(userId);
    return { ok: false, reason: "locked" };
  }
  return { ok: false, reason: "invalid" };
}

export async function deleteResetOtpsForUser(userId: number): Promise<void> {
  await clearResetRowsForUser(userId);
}