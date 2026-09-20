import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

export function createMigratedD1Database() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
  const migration = readFileSync(
    new URL("../sql/d1/0001_canonical_state.sql", import.meta.url),
    "utf8",
  );
  for (const statement of migration.split(/--> statement-breakpoint\s*/u)) {
    if (statement.trim()) sqlite.exec(statement);
  }
  return new SQLiteD1Database(sqlite);
}

class SQLiteD1Statement {
  #database;
  #query;
  #bindings = [];
  constructor(database, query) { this.#database = database; this.#query = query; }
  bind(...bindings) { const statement = new SQLiteD1Statement(this.#database, this.#query); statement.#bindings = bindings; return statement; }
  async first() { return this.#database.prepare(this.#query).get(...this.#bindings) ?? null; }
  async all() { return { success: true, results: this.#database.prepare(this.#query).all(...this.#bindings), meta: { changes: 0 } }; }
  async run() { return this.runSync(); }
  runSync() { const result = this.#database.prepare(this.#query).run(...this.#bindings); return { success: true, results: [], meta: { changes: Number(result.changes) } }; }
}
class SQLiteD1Database {
  #database;
  constructor(database) { this.#database = database; }
  prepare(query) { return new SQLiteD1Statement(this.#database, query); }
  async batch(statements) {
    this.#database.exec("BEGIN IMMEDIATE");
    try { const results = statements.map((statement) => statement.runSync()); this.#database.exec("COMMIT"); return results; }
    catch (error) { this.#database.exec("ROLLBACK"); throw error; }
  }
}
