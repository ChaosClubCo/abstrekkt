import Database from "better-sqlite3";
import path from "node:path";
import { logger } from "./logger.js";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "push.db");

export const db = new Database(DB_PATH);

export function initDB(): void {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      endpoint TEXT PRIMARY KEY,
      keys_p256dh TEXT NOT NULL,
      keys_auth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_sent_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_created
      ON subscriptions(created_at);
  `);

  logger.info({ path: DB_PATH }, "Database initialized");
}
