import { ArxGuard, ArxModule } from '@arx/nestjs';
import { ARX_TYPEORM_ENTITIES, TypeOrmAdapter } from '@arx/typeorm';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsModule } from './posts/posts.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // 1. TypeORM with SQLite — synchronize:true is fine for examples and local dev,
    // but use migrations in production (see @arx/typeorm README).
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [...ARX_TYPEORM_ENTITIES],
      synchronize: true,
    }),

    // 2. ArxModule — inject the TypeORM DataSource managed by @nestjs/typeorm
    ArxModule.forRootAsync({
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => ({
        adapter: new TypeOrmAdapter(dataSource),
        // Read user identity from the x-user-id header.
        // In a real app this would come from a JWT or session.
        getUserId: (req) => {
          const id = (req as Record<string, unknown>).headers as Record<string, string>;
          return id['x-user-id'] ?? undefined;
        },
      }),
    }),

    PostsModule,
    SeedModule,
  ],
  providers: [
    // 3. Apply ArxGuard globally — every route decorated with
    // @RequirePermissions or @RequireRole will be protected automatically.
    // Routes without either decorator are public.
    { provide: APP_GUARD, useClass: ArxGuard },
  ],
})
export class AppModule {}
