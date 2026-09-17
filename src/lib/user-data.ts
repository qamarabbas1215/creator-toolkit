import { queryRun, queryOne, queryAll } from "@/lib/db";

export interface ProjectRow {
  id: number;
  user_id: number;
  tool_slug: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export async function isFavorite(userId: number, toolSlug: string): Promise<boolean> {
  return Boolean(await queryOne("SELECT 1 FROM favorites WHERE user_id = ? AND tool_slug = ?", userId, toolSlug));
}

export async function getFavoriteSlugs(userId: number): Promise<string[]> {
  const rows = await queryAll<{ tool_slug: string }>(
    "SELECT tool_slug FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
    userId
  );
  return rows.map((r) => r.tool_slug);
}

export async function toggleFavorite(userId: number, toolSlug: string): Promise<boolean> {
  const favorited = await isFavorite(userId, toolSlug);
  if (favorited) {
    await queryRun("DELETE FROM favorites WHERE user_id = ? AND tool_slug = ?", userId, toolSlug);
    return false;
  }
  await queryRun(
    "INSERT INTO favorites (user_id, tool_slug, created_at) VALUES (?, ?, ?)",
    userId,
    toolSlug,
    Date.now()
  );
  return true;
}

export async function removeFavorite(userId: number, toolSlug: string): Promise<void> {
  await queryRun("DELETE FROM favorites WHERE user_id = ? AND tool_slug = ?", userId, toolSlug);
}

export async function recordToolUsage(userId: number, toolSlug: string): Promise<void> {
  const now = Date.now();
  await queryRun(
    `INSERT INTO tool_usage (user_id, tool_slug, runs, last_used_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(user_id, tool_slug)
     DO UPDATE SET runs = runs + 1, last_used_at = excluded.last_used_at`,
    userId,
    toolSlug,
    now
  );
  await queryRun(
    "INSERT INTO tool_usage_events (user_id, tool_slug, used_at) VALUES (?, ?, ?)",
    userId,
    toolSlug,
    now
  );
}

export async function getRecentToolSlugs(userId: number, limit = 8): Promise<string[]> {
  const rows = await queryAll<{ tool_slug: string }>(
    "SELECT tool_slug FROM tool_usage WHERE user_id = ? ORDER BY last_used_at DESC LIMIT ?",
    userId,
    limit
  );
  return rows.map((r) => r.tool_slug);
}

export async function getTopToolSlugs(
  userId: number,
  limit = 5
): Promise<{ slug: string; runs: number }[]> {
  const rows = await queryAll<{ tool_slug: string; runs: number }>(
    "SELECT tool_slug, runs FROM tool_usage WHERE user_id = ? ORDER BY runs DESC, last_used_at DESC LIMIT ?",
    userId,
    limit
  );
  return rows.map((r) => ({ slug: r.tool_slug, runs: r.runs }));
}

export async function getUsageStats(userId: number): Promise<{
  totalRuns: number;
  distinctTools: number;
  thisWeekRuns: number;
}> {
  const total = await queryOne<{ total: number }>(
    "SELECT COALESCE(SUM(runs), 0) AS total FROM tool_usage WHERE user_id = ?",
    userId
  );
  const distinct = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM tool_usage WHERE user_id = ?",
    userId
  );
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const week = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM tool_usage_events WHERE user_id = ? AND used_at >= ?",
    userId,
    weekStart
  );
  return {
    totalRuns: total?.total ?? 0,
    distinctTools: distinct?.c ?? 0,
    thisWeekRuns: week?.c ?? 0,
  };
}

export async function getProjects(userId: number): Promise<ProjectRow[]> {
  return queryAll<ProjectRow>(
    "SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC",
    userId
  );
}

export async function getProject(userId: number, id: number): Promise<ProjectRow | undefined> {
  return queryOne<ProjectRow>("SELECT * FROM projects WHERE user_id = ? AND id = ?", userId, id);
}

export async function createProject(
  userId: number,
  toolSlug: string,
  title: string,
  content: string
): Promise<ProjectRow> {
  const now = Date.now();
  const result = await queryRun(
    "INSERT INTO projects (user_id, tool_slug, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    userId,
    toolSlug,
    title,
    content,
    now,
    now
  );
  const project = await getProject(userId, result.lastInsertRowid);
  if (!project) throw new Error("Could not create project.");
  return project;
}

export async function updateProject(
  userId: number,
  id: number,
  fields: { title?: string; content?: string }
): Promise<ProjectRow | undefined> {
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
  await queryRun(`UPDATE projects SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`, ...values);
  return getProject(userId, id);
}

export async function deleteProject(userId: number, id: number): Promise<boolean> {
  const result = await queryRun("DELETE FROM projects WHERE id = ? AND user_id = ?", id, userId);
  return result.changes > 0;
}