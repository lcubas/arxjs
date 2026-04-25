import { type AnyDrizzleDB, DrizzleAdapter } from '../adapter';
import { schema } from '../schema/pg';

/**
 * Drizzle ORM adapter for PostgreSQL.
 *
 * Bundles the PostgreSQL schema internally — no schema argument needed.
 * Run `drizzle-kit generate` then `drizzle-kit migrate` (or push) using
 * the schema from `@arxjs/drizzle/schema/pg` before using this adapter.
 *
 * @example
 * import { drizzle } from 'drizzle-orm/postgres-js'
 * import postgres from 'postgres'
 * import { createAuthorization } from '@arxjs/core'
 * import { DrizzlePgAdapter } from '@arxjs/drizzle'
 *
 * const db = drizzle(postgres(process.env.DATABASE_URL))
 *
 * const { can, assignRole, createRole } = createAuthorization({
 *   adapter: new DrizzlePgAdapter(db),
 * })
 */
export class DrizzlePgAdapter extends DrizzleAdapter {
  constructor(db: AnyDrizzleDB) {
    super(db, schema);
  }
}
