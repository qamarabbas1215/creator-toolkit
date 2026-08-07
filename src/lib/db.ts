import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(path.join(dataDir, "creator-toolkit.db"));

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA busy_timeout = 5000;");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
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
    expires_at INTEGER NOT NULL
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

  CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
  CREATE INDEX IF NOT EXISTS idx_usage_user ON tool_usage (user_id);
  CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id);
  CREATE INDEX IF NOT EXISTS idx_usage_events_user_time ON tool_usage_events (user_id, used_at);
`);
