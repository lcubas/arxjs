import { type AnyDrizzleDB, DrizzleAdapter } from '../adapter';
import { schema } from '../schema/mysql';

/**
 * Drizzle ORM adapter for MySQL.
 *
 * Bundles the MySQL schema internally — no schema argument needed.
 * Run `drizzle-kit generate` then `drizzle-kit migrate` (or push) using
 * the schema from `@arx/drizzle/schema/mysql` before using this adapter.
 *
 * @example
 * import { drizzle } from 'drizzle-orm/mysql2'
 * import mysql from 'mysql2/promise'
 * import { createAuthorization } from '@arx/core'
 * import { DrizzleMysqlAdapter } from '@arx/drizzle'
 *
 * const connection = await mysql.createConnection(process.env.DATABASE_URL)
 * const db = drizzle(connection)
 *
 * const { can, assignRole, createRole } = createAuthorization({
 *   adapter: new DrizzleMysqlAdapter(db),
 * })
 */
export class DrizzleMysqlAdapter extends DrizzleAdapter {
  constructor(db: AnyDrizzleDB) {
    super(db, schema);
  }
}
