import path from "path";
import fs from "fs";
import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
const DB_PATH = path.join(process.cwd(), "data", "investpro.db");

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

let _db: SqlJsDatabase | null = null;
let _initPromise: Promise<SqlJsDatabase> | null = null;

export async function getDb(): Promise<SqlJsDatabase> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      const wasmPath = path.join(
        process.cwd(),
        "node_modules",
        "sql.js",
        "dist",
        "sql-wasm.wasm",
      );
      const wasmBinaryBuffer = fs.readFileSync(wasmPath);
      const wasmBinary = wasmBinaryBuffer.buffer.slice(
        wasmBinaryBuffer.byteOffset,
        wasmBinaryBuffer.byteOffset + wasmBinaryBuffer.byteLength
      );

      const SQL = await initSqlJs({ wasmBinary });

      ensureDir(path.dirname(DB_PATH));

      if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        _db = new SQL.Database(buffer);
      } else {
        _db = new SQL.Database();
      }

      _db.run("PRAGMA foreign_keys = ON;");

      // Users table
      _db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);

      _db.run(`
        CREATE TABLE IF NOT EXISTS entities (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          bank_name TEXT NOT NULL,
          initial_capital REAL NOT NULL DEFAULT 0,
          annual_interest REAL NOT NULL DEFAULT 0,
          savings_goal REAL NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      _db.run(`
        CREATE TABLE IF NOT EXISTS contributions (
          id TEXT PRIMARY KEY,
          entity_id TEXT NOT NULL,
          amount REAL NOT NULL,
          note TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
        );
      `);

      _db.run(`
        CREATE TABLE IF NOT EXISTS config (
          id TEXT PRIMARY KEY,
          creator_name TEXT NOT NULL DEFAULT 'Anonimo-sys19',
          contact TEXT NOT NULL DEFAULT 'WhatsApp 62228271 +CR'
        );
      `);

      const configCheck = _db.exec("SELECT id FROM config WHERE id = 'main'");
      if (configCheck.length === 0 || configCheck[0].values.length === 0) {
        _db.run(
          "INSERT INTO config (id, creator_name, contact) VALUES ('main', 'Anonimo-sys19', 'WhatsApp 62228271 +CR')",
        );
      }

      saveDb(_db);
      return _db;
    } catch (err) {
      _initPromise = null;
      throw err;
    }
  })();

  return _initPromise;
}

export function saveDb(db: SqlJsDatabase) {
  ensureDir(path.dirname(DB_PATH));
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function runSql(db: SqlJsDatabase, sql: string, params: import("sql.js").SqlValue[] = []) {
  if (params.length > 0) {
    const safeParams: import("sql.js").SqlValue[] = params.map((p) =>
      p === null || p === undefined ? "" : p,
    );
    const stmt = db.prepare(sql);
    stmt.bind(safeParams);
    stmt.step();
    stmt.free();
  } else {
    db.run(sql);
  }
}

export function queryAll<T>(
  db: SqlJsDatabase,
  sql: string,
  params: import("sql.js").SqlValue[] = [],
): T[] {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    // sql.js doesn't accept null — convert to empty string or appropriate default
    const safeParams: import("sql.js").SqlValue[] = params.map((p) =>
      p === null || p === undefined ? "" : p,
    );
    stmt.bind(safeParams);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function queryOne<T>(
  db: SqlJsDatabase,
  sql: string,
  params: import("sql.js").SqlValue[] = [],
): T | undefined {
  const results = queryAll<T>(db, sql, params);
  return results[0];
}

// Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Entity {
  id: string;
  user_id: string;
  bank_name: string;
  initial_capital: number;
  annual_interest: number;
  savings_goal: number;
  created_at: string;
}

export interface Contribution {
  id: string;
  entity_id: string;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface EntityWithContributions extends Entity {
  contributions: Contribution[];
}
