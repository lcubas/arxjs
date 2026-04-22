# arx

Authorization library for Node.js and TypeScript. Provides Role-Based Access Control (RBAC) with direct permission grants — storage-agnostic via an adapter pattern.

```ts
import { createAuthorization } from '@arx/core'
import { PrismaAdapter } from '@arx/prisma'

const { can, assignRole, createRole } = createAuthorization({
  adapter: new PrismaAdapter(prisma),
})

await createRole('editor', { permissions: ['post:edit', 'post:view'] })
await assignRole('user-1', 'editor')

await can('user-1', 'post:edit') // true
```

## Packages

| Package | Description |
|---|---|
| [`@arx/core`](packages/core) | Core authorization logic and `StorageAdapter` interface |
| [`@arx/prisma`](packages/prisma) | Adapter for [Prisma](https://www.prisma.io/) — PostgreSQL, MySQL, SQLite, SQL Server, MongoDB |
| [`@arx/drizzle`](packages/drizzle) | Adapter for [Drizzle ORM](https://orm.drizzle.team/) — PostgreSQL, MySQL, SQLite |
| [`@arx/typeorm`](packages/typeorm) | Adapter for [TypeORM](https://typeorm.io/) — PostgreSQL, MySQL, SQLite, SQL Server |
| [`@arx/nestjs`](packages/nestjs) | NestJS module, injectable `ArxService`, route guard, and decorators |

## How it works

arx separates the authorization logic from the database. You pick an adapter that matches your ORM, register it once, and use the same API regardless of your database.

Permissions can be granted to users directly, or through roles. The `can()` check resolves both sources automatically.

```
User ──── has role ────► Role ──── has permission ────► Permission
     └─── has permission (direct) ────────────────────► Permission
```

## License

MIT
