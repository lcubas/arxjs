/**
 * @arxjs/drizzle — Drizzle ORM adapter for the arx authorization library.
 *
 * ## Quick start
 *
 * Pick the adapter that matches your database dialect:
 *
 * ```ts
 * // PostgreSQL
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
 *
 * await createRole('editor', { permissions: ['edit:post', 'view:post'] })
 * await assignRole('user-1', 'editor')
 *
 * const allowed = await can('user-1', 'edit:post') // true
 * ```
 *
 * Available adapters:
 * - PostgreSQL → `DrizzlePgAdapter`
 * - MySQL      → `DrizzleMysqlAdapter`
 * - SQLite     → `DrizzleSqliteAdapter`
 *
 * If you need the raw schema objects (e.g. for drizzle-kit migrations):
 * - `@arxjs/drizzle/schema/pg`
 * - `@arxjs/drizzle/schema/mysql`
 * - `@arxjs/drizzle/schema/sqlite`
 *
 * @packageDocumentation
 */
export type { AnyDrizzleDB, ArxDrizzleSchema } from './adapter';
export { DrizzleAdapter } from './adapter';
export { DrizzleMysqlAdapter } from './adapters/mysql';
export { DrizzlePgAdapter } from './adapters/pg';
export { DrizzleSqliteAdapter } from './adapters/sqlite';
