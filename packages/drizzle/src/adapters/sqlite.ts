import { type AnyDrizzleDB, DrizzleAdapter } from '../adapter';
import { schema } from '../schema/sqlite';

/**
 * Drizzle ORM adapter for SQLite (better-sqlite3, Bun SQLite, libsql/Turso).
 *
 * Bundles the SQLite schema internally — no schema argument needed.
 * Run `drizzle-kit generate` then `drizzle-kit migrate` (or push) using
 * the schema from `@arx/drizzle/schema/sqlite` before using this adapter.
 *
 * @example
 * import { drizzle } from 'drizzle-orm/better-sqlite3'
 * import Database from 'better-sqlite3'
 * import { createAuthorization } from '@arx/core'
 * import { DrizzleSqliteAdapter } from '@arx/drizzle'
 *
 * const db = drizzle(new Database('sqlite.db'))
 *
 * const { can, assignRole, createRole } = createAuthorization({
 *   adapter: new DrizzleSqliteAdapter(db),
 * })
 */
export class DrizzleSqliteAdapter extends DrizzleAdapter {
  constructor(db: AnyDrizzleDB) {
    super(db, schema);
  }
}
