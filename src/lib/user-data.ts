import { db } from "@/lib/db";

export interface ProjectRow {
  id: number;
  user_id: number;
  tool_slug: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export function isFavorite(userId: number, toolSlug: string): boolean {
  return Boolean(
    db
      .prepare("SELECT 1 FROM favorites WHERE user_id = ? AND tool_slug = ?")
      .get(userId, toolSlug)
  );
}

export function getFavoriteSlugs(userId: number): string[] {
  const rows = db
    .prepare(
      "SELECT tool_slug FROM favorites WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(userId) as unknown as { tool_slug: string }[];
  return rows.map((r) => r.tool_slug);
}

export function toggleFavorite(userId: number, toolSlug: string): boolean {
  const favorited = isFavorite(userId, toolSlug);
  if (favorited) {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND tool_slug = ?").run(
      userId,
      toolSlug
    );
    return false;
  }
  db.prepare(
    "INSERT INTO favorites (user_id, tool_slug, created_at) VALUES (?, ?, ?)"
  ).run(userId, toolSlug, Date.now());
  return true;
}

export function removeFavorite(userId: number, toolSlug: string): void {
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND tool_slug = ?").run(
    userId,
    toolSlug
  );
}

export function recordToolUsage(userId: number, toolSlug: string): void {
  const now = Date.now();
  db.prepare(
    `INSERT INTO tool_usage (user_id, tool_slug, runs, last_used_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(user_id, tool_slug)
     DO UPDATE SET runs = runs + 1, last_used_at = excluded.last_used_at`
  ).run(userId, toolSlug, now);
  db.prepare(
    "INSERT INTO tool_usage_events (user_id, tool_slug, used_at) VALUES (?, ?, ?)"
  ).run(userId, toolSlug, now);
}

export function getRecentToolSlugs(userId: number, limit = 8): string[] {
  const rows = db
    .prepare(
      "SELECT tool_slug FROM tool_usage WHERE user_id = ? ORDER BY last_used_at DESC LIMIT ?"
    )
    .all(userId, limit) as unknown as { tool_slug: string }[];
  return rows.map((r) => r.tool_slug);
}

export function getTopToolSlugs(
  userId: number,
  limit = 5
): { slug: string; runs: number }[] {
  const rows = db
    .prepare(
      "SELECT tool_slug, runs FROM tool_usage WHERE user_id = ? ORDER BY runs DESC, last_used_at DESC LIMIT ?"
    )
    .all(userId, limit) as unknown as { tool_slug: string; runs: number }[];
  return rows.map((r) => ({ slug: r.tool_slug, runs: r.runs }));
}

export function getUsageStats(userId: number): {
  totalRuns: number;
  distinctTools: number;
  thisWeekRuns: number;
} {
  const total = db
    .prepare("SELECT COALESCE(SUM(runs), 0) AS total FROM tool_usage WHERE user_id = ?")
    .get(userId) as unknown as { total: number };
  const distinct = db
    .prepare("SELECT COUNT(*) AS c FROM tool_usage WHERE user_id = ?")
    .get(userId) as unknown as { c: number };
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const week = db
    .prepare(
      "SELECT COUNT(*) AS c FROM tool_usage_events WHERE user_id = ? AND used_at >= ?"
    )
    .get(userId, weekStart) as unknown as { c: number };
  return {
    totalRuns: total.total,
    distinctTools: distinct.c,
    thisWeekRuns: week.c,
  };
}

export function getProjects(userId: number): ProjectRow[] {
  return db
    .prepare(
      "SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC"
    )
    .all(userId) as unknown as ProjectRow[];
}

export function getProject(userId: number, id: number): ProjectRow | undefined {
  return db
    .prepare("SELECT * FROM projects WHERE user_id = ? AND id = ?")
    .get(userId, id) as unknown as ProjectRow | undefined;
}

export function createProject(
  userId: number,
  toolSlug: string,
  title: string,
  content: string
): ProjectRow {
  const now = Date.now();
  const result = db
    .prepare(
      "INSERT INTO projects (user_id, tool_slug, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(userId, toolSlug, title, content, now, now);
  const project = getProject(userId, Number(result.lastInsertRowid));
  if (!project) throw new Error("Could not create project.");
  return project;
}

export function updateProject(
  userId: number,
  id: number,
  fields: { title?: string; content?: string }
): ProjectRow | undefined {
  const sets: string[] = [];
  const values: (string | number)[] = [];
  if (fields.title !== undefined) {
    sets.push("title = ?");
    values.push(fields.title);
  }
  if (fields.content !== undefined) {
    sets.push("content = ?");
    values.push(fields.content);
  }
  if (sets.length === 0) return getProject(userId, id);
  sets.push("updated_at = ?");
  values.push(Date.now(), id, userId);
  db.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`).run(
    ...values
  );
  return getProject(userId, id);
}

export function deleteProject(userId: number, id: number): boolean {
  const result = db
    .prepare("DELETE FROM projects WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}
