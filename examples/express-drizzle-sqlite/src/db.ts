import { createAuthorization } from '@arxjs/core';
import { DrizzleSqliteAdapter } from '@arxjs/drizzle';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

// 1. Database Setup
const sqlite = new Database(':memory:');
export const db = drizzle(sqlite);

// 2. ARX Adapter Initialization
export const auth = createAuthorization({
  adapter: new DrizzleSqliteAdapter(db),
});

// 3. Helper to initialize tables (simulating migrations)
export async function initTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS permissions (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS role_permissions (role_id TEXT NOT NULL REFERENCES roles(id), permission_id TEXT NOT NULL REFERENCES permissions(id), assigned_at INTEGER NOT NULL, PRIMARY KEY(role_id, permission_id));
    CREATE TABLE IF NOT EXISTS user_roles (user_id TEXT NOT NULL, role_id TEXT NOT NULL REFERENCES roles(id), assigned_at INTEGER NOT NULL, PRIMARY KEY(user_id, role_id));
    CREATE TABLE IF NOT EXISTS user_permissions (user_id TEXT NOT NULL, permission_id TEXT NOT NULL REFERENCES permissions(id), assigned_at INTEGER NOT NULL, PRIMARY KEY(user_id, permission_id));
  `);
}
