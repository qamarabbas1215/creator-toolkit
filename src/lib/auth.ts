import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { SessionUser } from "@/lib/session-types";

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = "ctk_session";
export const SESSION_DAYS = 30;

export interface UserRow extends SessionUser {
  password_hash: string;
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

export function createSessionToken(userId: number): { token: string; expiresAt: number } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    expiresAt
  );
  return { token, expiresAt };
}

export function deleteSessionToken(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function deleteAllSessionsForUser(userId: number): void {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
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
  const row = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.password_hash, u.plan, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`
    )
    .get(token, Date.now()) as unknown as UserRow | undefined;
  return row ? toSessionUser(row) : null;
}

export function getUserById(id: number): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown as UserRow | undefined;
}

export function getUserByEmail(email: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as unknown as UserRow | undefined;
}

export function updateUserProfile(
  id: number,
  fields: { name?: string; email?: string }
): UserRow | undefined {
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
  db.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return getUserById(id);
}

export function updateUserPassword(id: number, passwordHash: string): void {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, id);
}

export function deleteUser(id: number): void {
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}
