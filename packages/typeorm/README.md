# @arx/typeorm

TypeORM adapter for [`@arx/core`](../core/README.md). Supports any database TypeORM supports: PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, and more.

## Installation

```bash
npm install @arx/core @arx/typeorm typeorm reflect-metadata
```

> **Note:** TypeORM requires `reflect-metadata` to be imported once at the very top of your application entry point (before any other imports).

## Quick start

```ts
// main.ts — must be the first import
import 'reflect-metadata'

import { DataSource } from 'typeorm'
import { createAuthorization } from '@arx/core'
import { TypeOrmAdapter, ARX_TYPEORM_ENTITIES } from '@arx/typeorm'

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [...ARX_TYPEORM_ENTITIES],
  synchronize: true, // use migrations in production
})

await dataSource.initialize()

const { can, assignRole, createRole, grantPermission } = createAuthorization({
  adapter: new TypeOrmAdapter(dataSource),
})

// Create roles and permissions
await createRole('editor', { permissions: ['edit:post', 'view:post'] })
await createRole('viewer', { permissions: ['view:post'] })

// Assign a role to a user
await assignRole('user-1', 'editor')

// Check permissions
await can('user-1', 'edit:post') // true
await can('user-1', 'delete:post') // false
```

## TypeORM setup

### tsconfig.json

TypeORM decorators require the following compiler options:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Entities

All five arx entities must be registered in your `DataSource`. Use `ARX_TYPEORM_ENTITIES` for convenience:

```ts
import { ARX_TYPEORM_ENTITIES } from '@arx/typeorm'

new DataSource({
  entities: [...ARX_TYPEORM_ENTITIES],
})
```

Or register them individually if you prefer:

```ts
import {
  ArxRole, ArxPermission, ArxRolePermission,
  ArxUserRole, ArxUserPermission,
} from '@arx/typeorm'

new DataSource({
  entities: [ArxRole, ArxPermission, ArxRolePermission, ArxUserRole, ArxUserPermission],
})
```

### Migrations

For production, generate migrations with `typeorm-ts-node-commonjs`:

```bash
npx typeorm-ts-node-commonjs migration:generate src/migrations/ArxInit -d src/data-source.ts
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

## Tables created

| Table | Description |
|---|---|
| `arx_roles` | Role definitions |
| `arx_permissions` | Permission definitions |
| `arx_role_permissions` | Role → permission grants |
| `arx_user_roles` | User → role assignments |
| `arx_user_permissions` | Direct user → permission grants |

## NestJS integration

Use together with [`@arx/nestjs`](../nestjs/README.md):

```ts
import 'reflect-metadata'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArxModule } from '@arx/nestjs'
import { TypeOrmAdapter, ARX_TYPEORM_ENTITIES } from '@arx/typeorm'
import { DataSource } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [...ARX_TYPEORM_ENTITIES],
    }),
    ArxModule.forRootAsync({
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => ({
        adapter: new TypeOrmAdapter(dataSource),
        getUserId: (req) => (req as { user?: { id?: string } }).user?.id,
      }),
    }),
  ],
})
export class AppModule {}
```
