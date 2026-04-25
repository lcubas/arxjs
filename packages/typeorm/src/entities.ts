import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/**
 * TypeORM entity for arx roles.
 *
 * Register this entity (along with the other arx entities) in your DataSource:
 *
 * @example
 * import { DataSource } from 'typeorm'
 * import {
 *   ArxRole, ArxPermission, ArxRolePermission,
 *   ArxUserRole, ArxUserPermission,
 * } from '@arxjs/typeorm'
 *
 * const dataSource = new DataSource({
 *   type: 'postgres',
 *   entities: [ArxRole, ArxPermission, ArxRolePermission, ArxUserRole, ArxUserPermission],
 * })
 */
@Entity('arx_roles')
export class ArxRole {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

/** TypeORM entity for arx permissions. */
@Entity('arx_permissions')
export class ArxPermission {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

/** Junction table linking roles to their permissions. */
@Entity('arx_role_permissions')
export class ArxRolePermission {
  @PrimaryColumn({ name: 'role_id', type: 'varchar', length: 36 })
  roleId!: string;

  @PrimaryColumn({ name: 'permission_id', type: 'varchar', length: 36 })
  permissionId!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}

/** Junction table linking users to their roles. */
@Entity('arx_user_roles')
export class ArxUserRole {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 255 })
  userId!: string;

  @PrimaryColumn({ name: 'role_id', type: 'varchar', length: 36 })
  roleId!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}

/** Junction table for direct user → permission grants. */
@Entity('arx_user_permissions')
export class ArxUserPermission {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 255 })
  userId!: string;

  @PrimaryColumn({ name: 'permission_id', type: 'varchar', length: 36 })
  permissionId!: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;
}

/** Convenience array of all arx entities — spread into your DataSource `entities` config. */
export const ARX_TYPEORM_ENTITIES = [
  ArxRole,
  ArxPermission,
  ArxRolePermission,
  ArxUserRole,
  ArxUserPermission,
] as const;
