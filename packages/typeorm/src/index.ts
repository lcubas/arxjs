/**
 * @arx/typeorm — TypeORM adapter for the arx authorization library.
 *
 * ## Quick start
 *
 * ```ts
 * import 'reflect-metadata'
 * import { DataSource } from 'typeorm'
 * import { createAuthorization } from '@arx/core'
 * import { TypeOrmAdapter, ARX_TYPEORM_ENTITIES } from '@arx/typeorm'
 *
 * const dataSource = new DataSource({
 *   type: 'postgres',
 *   url: process.env.DATABASE_URL,
 *   entities: [...ARX_TYPEORM_ENTITIES],
 *   synchronize: true, // use migrations in production
 * })
 *
 * await dataSource.initialize()
 *
 * const { can, assignRole, createRole } = createAuthorization({
 *   adapter: new TypeOrmAdapter(dataSource),
 * })
 *
 * await createRole('editor', { permissions: ['edit:post', 'view:post'] })
 * await assignRole('user-1', 'editor')
 *
 * const allowed = await can('user-1', 'edit:post') // true
 * ```
 *
 * @packageDocumentation
 */
export { TypeOrmAdapter } from './adapter';
export {
  ARX_TYPEORM_ENTITIES,
  ArxPermission,
  ArxRole,
  ArxRolePermission,
  ArxUserPermission,
  ArxUserRole,
} from './entities';
