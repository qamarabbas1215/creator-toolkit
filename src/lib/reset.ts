import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken(userId: number): string {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + RESET_TOKEN_TTL_MS;
  db.prepare(
    "INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(hashToken(token), userId, expiresAt);
  return token;
}

export function consumePasswordResetToken(token: string): number | null {
  const hash = hashToken(token);
  const row = db
    .prepare("SELECT user_id, expires_at FROM password_resets WHERE token_hash = ?")
    .get(hash) as unknown as { user_id: number; expires_at: number } | undefined;
  db.prepare("DELETE FROM password_resets WHERE token_hash = ?").run(hash);
  if (!row || row.expires_at < Date.now()) return null;
  return row.user_id;
}

export function deletePasswordResetTokensForUser(userId: number): void {
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
}
