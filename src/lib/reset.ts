import { createHash, randomInt } from "node:crypto";
import { db } from "@/lib/db";

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

function latestResetRow(userId: number): ResetRow | undefined {
  return db
    .prepare(
      "SELECT token_hash, user_id, expires_at, attempts FROM password_resets WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1"
    )
    .get(userId) as unknown as ResetRow | undefined;
}

function clearResetRowsForUser(userId: number): void {
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
}

export function generateResetOtp(userId: number): string {
  clearResetRowsForUser(userId);
  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = Date.now() + RESET_OTP_TTL_MS;
  db.prepare(
    "INSERT INTO password_resets (token_hash, user_id, expires_at, attempts) VALUES (?, ?, ?, 0)"
  ).run(hashOtp(otp), userId, expiresAt);
  return otp;
}

export function consumeResetOtp(userId: number, otp: string): ConsumeResetOtpResult {
  const row = latestResetRow(userId);
  if (!row) return { ok: false, reason: "invalid" };

  if (row.expires_at < Date.now()) {
    clearResetRowsForUser(userId);
    return { ok: false, reason: "expired" };
  }

  if (row.attempts >= RESET_OTP_MAX_ATTEMPTS) {
    clearResetRowsForUser(userId);
    return { ok: false, reason: "locked" };
  }

  if (row.token_hash === hashOtp(otp)) {
    clearResetRowsForUser(userId);
    return { ok: true };
  }

  const attempts = row.attempts + 1;
  db.prepare("UPDATE password_resets SET attempts = ? WHERE token_hash = ?").run(
    attempts,
    row.token_hash
  );
  if (attempts >= RESET_OTP_MAX_ATTEMPTS) {
    clearResetRowsForUser(userId);
    return { ok: false, reason: "locked" };
  }
  return { ok: false, reason: "invalid" };
}

export function deleteResetOtpsForUser(userId: number): void {
  clearResetRowsForUser(userId);
}
