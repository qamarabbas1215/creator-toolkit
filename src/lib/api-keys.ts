import { createHash, randomBytes } from "node:crypto";
import { queryOne, queryRun, queryAll } from "@/lib/db";

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

export async function createApiKey(userId: number, name: string): Promise<{ key: string; row: ApiKeyRow }> {
  const key = generateApiKey();
  const prefix = key.slice(0, API_KEY_PREFIX.length + 8);
  const now = Date.now();
  await queryRun(
    "INSERT INTO api_keys (user_id, name, key_hash, prefix, created_at) VALUES (?, ?, ?, ?, ?)",
    userId,
    name,
    hashApiKey(key),
    prefix,
    now
  );
  const row = await getApiKeyByHash(hashApiKey(key));
  if (!row) throw new Error("Could not create API key.");
  return { key, row };
}

export async function getApiKeyByHash(keyHash: string): Promise<ApiKeyRow | undefined> {
  return queryOne<ApiKeyRow>("SELECT * FROM api_keys WHERE key_hash = ?", keyHash);
}

export async function getApiKeyById(userId: number, id: number): Promise<ApiKeyRow | undefined> {
  return queryOne<ApiKeyRow>("SELECT * FROM api_keys WHERE id = ? AND user_id = ?", id, userId);
}

export async function listApiKeys(userId: number): Promise<ApiKeyRow[]> {
  return queryAll<ApiKeyRow>("SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC", userId);
}

export async function revokeApiKey(userId: number, id: number): Promise<boolean> {
  const result = await queryRun("DELETE FROM api_keys WHERE id = ? AND user_id = ?", id, userId);
  return result.changes > 0;
}

export async function touchApiKey(id: number): Promise<void> {
  await queryRun("UPDATE api_keys SET last_used_at = ? WHERE id = ?", Date.now(), id);
}

export async function recordApiRequest(
  apiKeyId: number | null,
  toolSlug: string,
  statusCode: number,
  ip: string | null
): Promise<void> {
  await queryRun(
    "INSERT INTO api_requests (api_key_id, tool_slug, status_code, ip, created_at) VALUES (?, ?, ?, ?, ?)",
    apiKeyId,
    toolSlug,
    statusCode,
    ip,
    Date.now()
  );
}

export async function requestsInWindow(apiKeyId: number): Promise<number> {
  const start = Date.now() - RATE_WINDOW_MS;
  const row = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id = ? AND created_at >= ?",
    apiKeyId,
    start
  );
  return row?.c ?? 0;
}

export async function getApiUsage(userId: number): Promise<{
  keys: number;
  totalRequests: number;
  thisMonthRequests: number;
  perKey: { id: number; requests: number }[];
}> {
  const keys = await listApiKeys(userId);
  const monthStart = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const perKey: { id: number; requests: number }[] = [];
  for (const k of keys) {
    const row = await queryOne<{ c: number }>(
      "SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id = ?",
      k.id
    );
    perKey.push({ id: k.id, requests: row?.c ?? 0 });
  }
  const total = perKey.reduce((sum, k) => sum + k.requests, 0);
  let thisMonth = 0;
  if (keys.length > 0) {
    const placeholders = keys.map(() => "?").join(",");
    const row = await queryOne<{ c: number }>(
      `SELECT COUNT(*) AS c FROM api_requests WHERE api_key_id IN (${placeholders}) AND created_at >= ?`,
      ...keys.map((k) => k.id),
      monthStart
    );
    thisMonth = row?.c ?? 0;
  }
  return { keys: keys.length, totalRequests: total, thisMonthRequests: thisMonth, perKey };
}

export function rateLimitForPlan(plan: string): number {
  return plan === "pro" ? PRO_RATE_LIMIT_PER_HOUR : FREE_RATE_LIMIT_PER_HOUR;
}