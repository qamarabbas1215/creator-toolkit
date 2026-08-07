import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export interface ApiKeyRow {
  id: number;
  user_id: number;
  name: string;
  key_hash: string;
  prefix: string;
  created_at: number;
  last_used_at: number | null;
}

export const API_KEY_PREFIX = "ctk_";
export const API_KEY_BYTES = 24;

export const FREE_RATE_LIMIT_PER_HOUR = 60;
export const PRO_RATE_LIMIT_PER_HOUR = 1000;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(API_KEY_BYTES).toString("hex");
}

export function createApiKey(userId: number, name: string): { key: string; row: ApiKeyRow } {
  const key = generateApiKey();
  const prefix = key.slice(0, API_KEY_PREFIX.length + 8);
  const now = Date.now();
  db.prepare(
    "INSERT INTO api_keys (user_id, name, key_hash, prefix, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(userId, name, hashApiKey(key), prefix, now);
  const row = getApiKeyByHash(hashApiKey(key));
  if (!row) throw new Error("Could not create API key.");
  return { key, row };
}

export function getApiKeyByHash(keyHash: string): ApiKeyRow | undefined {
  return db
    .prepare("SELECT * FROM api_keys WHERE key_hash = ?")
    .get(keyHash) as unknown as ApiKeyRow | undefined;
}

export function getApiKeyById(userId: number, id: number): ApiKeyRow | undefined {
  return db
    .prepare("SELECT * FROM api_keys WHERE id = ? AND user_id = ?")
    .get(id, userId) as unknown as ApiKeyRow | undefined;
}

export function listApiKeys(userId: number): ApiKeyRow[] {
  return db
    .prepare("SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as unknown as ApiKeyRow[];
}

export function revokeApiKey(userId: number, id: number): boolean {
  const result = db.prepare("DELETE FROM api_keys WHERE id = ? AND user_id = ?").run(id, userId);
  return result.changes > 0;
}

export function touchApiKey(id: number): void {
  db.prepare("UPDATE api_keys SET last_used_at = ? WHERE id = ?").run(Date.now(), id);
}

export function recordApiRequest(
  apiKeyId: number | null,
  toolSlug: string,
  statusCode: number,
  ip: string | null
): void {
  db.prepare(
    "INSERT INTO api_requests (api_key_id, tool_slug, status_code, ip, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(apiKeyId, toolSlug, statusCode, ip, Date.now());
}

export function requestsInWindow(apiKeyId: number): number {
  const start = Date.now() - RATE_WINDOW_MS;
  const row = db
    .prepare(
      "SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id = ? AND created_at >= ?"
    )
    .get(apiKeyId, start) as unknown as { c: number };
  return row.c;
}

export function getApiUsage(userId: number): {
  keys: number;
  totalRequests: number;
  thisMonthRequests: number;
  perKey: { id: number; requests: number }[];
} {
  const keys = listApiKeys(userId);
  const monthStart = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const keyIds = keys.map((k) => k.id);
  const perKey = keyIds.map((id) => {
    const row = db
      .prepare("SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id = ?")
      .get(id) as unknown as { c: number };
    return { id, requests: row.c };
  });
  const total = perKey.reduce((sum, k) => sum + k.requests, 0);
  let thisMonth = 0;
  if (keyIds.length > 0) {
    const placeholders = keyIds.map(() => "?").join(",");
    const row = db
      .prepare(
        `SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id IN (${placeholders}) AND created_at >= ?`
      )
      .get(...keyIds, monthStart) as unknown as { c: number };
    thisMonth = row.c;
  }
  return { keys: keys.length, totalRequests: total, thisMonthRequests: thisMonth, perKey };
}

export function rateLimitForPlan(plan: string): number {
  return plan === "pro" ? PRO_RATE_LIMIT_PER_HOUR : FREE_RATE_LIMIT_PER_HOUR;
}
