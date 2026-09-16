import { queryRun, queryOne } from "@/lib/db";

export interface ThrottleResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Simple sliding-window limiter persisted in the database. Ensure at most
 * `max` calls for `kind:key` within `windowMs`. Old rows are swept lazily.
 */
export async function throttle(
  kind: string,
  key: string,
  max: number,
  windowMs: number
): Promise<ThrottleResult> {
  const now = Date.now();
  const start = now - windowMs;

  await queryRun("DELETE FROM throttle WHERE created_at < ?", start);

  const count = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM throttle WHERE kind = ? AND key = ? AND created_at >= ?",
    kind,
    key,
    start
  );

  if ((count?.c ?? 0) >= max) {
    const earliest = await queryOne<{ m: number | null }>(
      "SELECT MIN(created_at) AS m FROM throttle WHERE kind = ? AND key = ? AND created_at >= ?",
      kind,
      key,
      start
    );
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, (earliest?.m ?? start) + windowMs - now),
    };
  }

  await queryRun("INSERT INTO throttle (kind, key, created_at) VALUES (?, ?, ?)", kind, key, now);
  return { allowed: true, remaining: max - (count?.c ?? 0) - 1, retryAfterMs: 0 };
}