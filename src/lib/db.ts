import fs from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ */
/*  Unified async database layer                                       */
/*  – When DATABASE_URL is set, uses Neon Postgres (serverless).       */
/*  – Otherwise falls back to local SQLite (node:sqlite).              */
/* ------------------------------------------------------------------ */

export interface QueryRow {
  [column: string]: unknown;
}

export interface RunResult {
  changes: number;
  lastInsertRowid: number;
}

/* ------------------------------------------------------------------ */
/*  Postgres backend                                                    */
/* ------------------------------------------------------------------ */

interface PgPool {
  query(sql: string, args?: unknown[]): Promise<{ rows: QueryRow[]; rowCount: number }>;
  end(): Promise<void>;
}

let pgPool: PgPool | null = null;

/**
 * Map SQLite-style `?` placeholders to Postgres `$1`, `$2`, … while
 * skipping `?` characters inside single/double-quoted string literals.
 * Returns the original text unchanged when there are no arguments.
 */
function toPgQuery(text: string, args: unknown[]): { text: string; params: unknown[] } {
  if (args.length === 0) return { text, params: args };
  let out = "";
  let index = 0;
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      out += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === "?") {
      index++;
      out += `$${index}`;
      continue;
    }
    out += ch;
  }
  return { text: out, params: args };
}

async function getPgPool(): Promise<PgPool> {
  if (pgPool) return pgPool;
  const { neon } = await import("@neondatabase/serverless");
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  pgPool = {
    async query(text, args = []) {
      const converted = toPgQuery(text, args);
      const res = (await sql.query(converted.text, converted.params, {
        fullResults: true,
      })) as { rows: QueryRow[]; rowCount: number };
      return { rows: res.rows, rowCount: res.rowCount };
    },
    async end() {
      /* neon http pool – nothing to tear down */
    },
  };
  return pgPool;
}

/* ------------------------------------------------------------------ */
/*  SQLite backend (node:sqlite — synchronous, wrapped in Promises)     */
/* ------------------------------------------------------------------ */

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "creator-toolkit.db");

type SqliteDb = import("node:sqlite").DatabaseSync;
type SqliteInput = import("node:sqlite").SQLInputValue;

let sqliteDb: SqliteDb | null = null;

function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function withInitRetry(fn: () => void): void {
  const deadline = Date.now() + 30_000;
  for (;;) {
    try {
      fn();
      return;
    } catch (err) {
      const locked =
        (err as { code?: string })?.code === "ERR_SQLITE_ERROR" &&
        (err as { errcode?: number })?.errcode === 261;
      if (!locked || Date.now() > deadline) throw err;
      sleep(50);
    }
  }
}

async function getSqliteDb(): Promise<SqliteDb> {
  if (sqliteDb) return sqliteDb;
  const { DatabaseSync } = await import("node:sqlite");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const fresh: SqliteDb = new DatabaseSync(dbPath);
  fresh.exec("PRAGMA journal_mode = WAL;");
  fresh.exec("PRAGMA busy_timeout = 10000;");
  fresh.exec("PRAGMA synchronous = NORMAL;");
  initSchema(fresh);
  sqliteDb = fresh;
  return sqliteDb;
}

function initSchema(db: SqliteDb): void {
  withInitRetry(() =>
    db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    email_verified INTEGER NOT NULL DEFAULT 1,
    email_verified_at INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, tool_slug)
  );

  CREATE TABLE IF NOT EXISTS tool_usage (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    runs INTEGER NOT NULL DEFAULT 1,
    last_used_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, tool_slug)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tool_usage_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    used_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    prefix TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_used_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS api_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id INTEGER REFERENCES api_keys(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    ip TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS email_verifications (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS throttle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    key TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
  CREATE INDEX IF NOT EXISTS idx_usage_user ON tool_usage (user_id);
  CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id);
  CREATE INDEX IF NOT EXISTS idx_usage_events_user_time ON tool_usage_events (user_id, used_at);
  CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys (user_id);
  CREATE INDEX IF NOT EXISTS idx_api_requests_key_time ON api_requests (api_key_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id);
  CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications (user_id);
  CREATE INDEX IF NOT EXISTS idx_throttle_kind_key ON throttle (kind, key, created_at);
  `)
  );
  // Tolerant migration for columns that may not exist on older DBs
  try {
    db.exec("ALTER TABLE password_resets ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0");
  } catch { /* already exists */ }
  try {
    db.exec("ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 1");
  } catch { /* already exists */ }
  try {
    db.exec("ALTER TABLE users ADD COLUMN email_verified_at INTEGER");
  } catch { /* already exists */ }
}

function isPg(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/* ------------------------------------------------------------------ */
/*  Postgres schema init (run once at startup)                          */
/* ------------------------------------------------------------------ */

let pgSchemaReady = false;

const PG_SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    email_verified INTEGER NOT NULL DEFAULT 1,
    email_verified_at BIGINT,
    created_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS password_resets (
    token_hash TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    PRIMARY KEY (user_id, tool_slug)
  )`,
  `CREATE TABLE IF NOT EXISTS tool_usage (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    runs INTEGER NOT NULL DEFAULT 1,
    last_used_at BIGINT NOT NULL,
    PRIMARY KEY (user_id, tool_slug)
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tool_usage_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    used_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS api_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    prefix TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    last_used_at BIGINT
  )`,
  `CREATE TABLE IF NOT EXISTS api_requests (
    id BIGSERIAL PRIMARY KEY,
    api_key_id BIGINT REFERENCES api_keys(id) ON DELETE CASCADE,
    tool_slug TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    ip TEXT,
    created_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS email_verifications (
    token_hash TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS throttle (
    id BIGSERIAL PRIMARY KEY,
    kind TEXT NOT NULL,
    key TEXT NOT NULL,
    created_at BIGINT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_usage_user ON tool_usage (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_usage_events_user_time ON tool_usage_events (user_id, used_at)`,
  `CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_api_requests_key_time ON api_requests (api_key_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_throttle_kind_key ON throttle (kind, key, created_at)`,
  `ALTER TABLE password_resets ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified INTEGER NOT NULL DEFAULT 1`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at BIGINT`,
];

async function ensurePgSchema(): Promise<void> {
  if (pgSchemaReady) return;
  const pool = await getPgPool();
  for (const stmt of PG_SCHEMA_STATEMENTS) {
    await pool.query(stmt);
  }
  pgSchemaReady = true;
}

/* ------------------------------------------------------------------ */
/*  Public async query API                                              */
/* ------------------------------------------------------------------ */

/** Run a SQL statement (INSERT/UPDATE/DELETE). Returns run metadata. */
export async function queryRun(sql: string, ...params: unknown[]): Promise<RunResult> {
  if (isPg()) {
    await ensurePgSchema();
    const pool = await getPgPool();
    const res = await pool.query(sql, params);
    // For INSERT RETURNING id, extract from last row
    const lastRow = res.rows[res.rows.length - 1] as Record<string, unknown> | undefined;
    const lastId = lastRow?.id != null ? Number(lastRow.id) : 0;
    return { changes: res.rowCount, lastInsertRowid: lastId };
  }
  // SQLite
  const db = await getSqliteDb();
  let result: { changes: number; lastInsertRowid: bigint | number };
  if (params.length > 0) {
    result = db.prepare(sql).run(...(params as SqliteInput[])) as unknown as typeof result;
  } else {
    result = db.prepare(sql).run() as unknown as typeof result;
  }
  return {
    changes: result.changes,
    lastInsertRowid: Number(result.lastInsertRowid),
  };
}

/** Fetch a single row, or undefined if none matches. */
export async function queryOne<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T | undefined> {
  if (isPg()) {
    await ensurePgSchema();
    const pool = await getPgPool();
    const res = await pool.query(sql, params);
    return (res.rows[0] as T) ?? undefined;
  }
  const db = await getSqliteDb();
  let row: unknown;
  if (params.length > 0) {
    row = db.prepare(sql).get(...(params as SqliteInput[]));
  } else {
    row = db.prepare(sql).get();
  }
  return (row as T) ?? undefined;
}

/** Fetch all matching rows. */
export async function queryAll<T = QueryRow>(sql: string, ...params: unknown[]): Promise<T[]> {
  if (isPg()) {
    await ensurePgSchema();
    const pool = await getPgPool();
    const res = await pool.query(sql, params);
    return res.rows as T[];
  }
  const db = await getSqliteDb();
  let rows: unknown[];
  if (params.length > 0) {
    rows = db.prepare(sql).all(...(params as SqliteInput[])) as unknown[];
  } else {
    rows = db.prepare(sql).all() as unknown[];
  }
  return rows as T[];
}
