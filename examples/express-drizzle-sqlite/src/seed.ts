import { auth } from './db';

/**
 * Seed roles, permissions, and user assignments to the DB via ARX.
 */
export async function seedData() {
  console.log('--- Seeding ARX Roles and Permissions ---');

  // 1. Create permissions and roles for "blog" system

  const permissions = [
    'posts:create',
    'posts:read',
    'posts:update',
    'posts:delete',
    'users:manage',
  ];

  // Permissions must exist before they can be assigned to roles
  await Promise.all(
    permissions.map((permission) => auth.createPermission(permission, { ifExists: 'ignore' })),
  );

  // ADMIN role
  await auth.createRole('admin', {
    ifExists: 'ignore',
    permissions: ['posts:create', 'posts:read', 'posts:update', 'posts:delete', 'users:manage'],
  });

  // EDITOR role
  await auth.createRole('editor', {
    ifExists: 'ignore',
    permissions: ['posts:create', 'posts:read', 'posts:update'],
  });

  // VIEWER role
  await auth.createRole('viewer', {
    ifExists: 'ignore',
    permissions: ['posts:read'],
  });

  // 2. Assign roles to specific test users
  await auth.assignRole('user-1', 'admin'); // Complete access
  await auth.assignRole('user-2', 'editor'); // Read/Write access
  await auth.assignRole('user-3', 'viewer'); // Read-only access

  console.log('--- Seed Completed Successfully ---');
}
