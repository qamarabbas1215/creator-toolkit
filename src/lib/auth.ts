import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { queryOne, queryRun } from "@/lib/db";
import type { SessionUser } from "@/lib/session-types";

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = "ctk_session";
export const SESSION_DAYS = 30;

export interface UserRow extends SessionUser {
  password_hash: string;
  email_verified?: number;
  email_verified_at?: number | null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  return hash.length === expected.length && timingSafeEqual(hash, expected);
}

export function toSessionUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    plan: row.plan,
    created_at: row.created_at,
  };
}

export async function createSessionToken(userId: number): Promise<{ token: string; expiresAt: number }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  await queryRun(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    token,
    userId,
    expiresAt
  );
  return { token, expiresAt };
}

export async function deleteSessionToken(token: string): Promise<void> {
  await queryRun("DELETE FROM sessions WHERE token = ?", token);
}

export async function deleteAllSessionsForUser(userId: number): Promise<void> {
  await queryRun("DELETE FROM sessions WHERE user_id = ?", userId);
}

export function sessionCookieOptions(expiresAt?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  };
}

export function clearSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await queryOne<UserRow>(
    `SELECT u.id, u.name, u.email, u.password_hash, u.plan, u.created_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > ?`,
    token,
    Date.now()
  );
  return row ? toSessionUser(row) : null;
}

export async function getUserById(id: number): Promise<UserRow | undefined> {
  return queryOne<UserRow>("SELECT * FROM users WHERE id = ?", id);
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  return queryOne<UserRow>("SELECT * FROM users WHERE email = ?", email);
}

export async function updateUserProfile(
  id: number,
  fields: { name?: string; email?: string }
): Promise<UserRow | undefined> {
  const sets: string[] = [];
  const values: (string | number)[] = [];
  if (fields.name !== undefined) {
    sets.push("name = ?");
    values.push(fields.name);
  }
  if (fields.email !== undefined) {
    sets.push("email = ?");
    values.push(fields.email);
  }
  if (sets.length === 0) return getUserById(id);
  values.push(id);
  await queryRun(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, ...values);
  return getUserById(id);
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<void> {
  await queryRun("UPDATE users SET password_hash = ? WHERE id = ?", passwordHash, id);
}

export async function deleteUser(id: number): Promise<void> {
  await queryRun("DELETE FROM users WHERE id = ?", id);
}
