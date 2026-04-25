import type { StorageAdapter } from '@arx/core';
import type { ExecutionContext } from '@nestjs/common';

/**
 * Options passed to ArxModule.forRoot().
 */
export interface ArxModuleOptions {
  /** The storage adapter (Prisma, Drizzle, or a custom implementation). */
  adapter: StorageAdapter;

  /**
   * Extracts the current user's ID from the incoming HTTP request.
   * Called by ArxGuard on every guarded route.
   *
   * @example
   * // JWT strategy (e.g. Passport JWT populates request.user)
   * getUserId: (req) => req.user?.id
   *
   * @example
   * // API key resolved to a user id earlier in the pipeline
   * getUserId: (req) => req.userId
   */
  getUserId: (request: Record<string, unknown>) => string | undefined;

  /**
   * Called by ArxGuard when no user ID can be resolved from the request.
   * Use this to throw your application's own UnauthorizedException.
   *
   * If omitted the guard returns `false`, which NestJS converts to a 403.
   *
   * @example
   * import { UnauthorizedException } from '@nestjs/common';
   * onUnauthorized: () => { throw new UnauthorizedException(); }
   */
  onUnauthorized?: (ctx: ExecutionContext) => never;

  /**
   * Called by ArxGuard when the user lacks the required role or permission.
   * Use this to throw your application's own ForbiddenException.
   *
   * If omitted the guard returns `false`, which NestJS converts to a 403.
   *
   * @example
   * import { ForbiddenException } from '@nestjs/common';
   * onForbidden: () => { throw new ForbiddenException(); }
   */
  onForbidden?: (ctx: ExecutionContext) => never;

  /**
   * When true (default), ArxModule is registered as a global module so
   * ArxService and ArxGuard are available across the entire application
   * without importing ArxModule in every feature module.
   */
  isGlobal?: boolean;
}

/**
 * Async variant of ArxModuleOptions for when the adapter or getUserId
 * function depend on asynchronous providers (e.g. ConfigService).
 */
export interface ArxModuleAsyncOptions<TArgs extends unknown[] = unknown[]> {
  useFactory: (...args: TArgs) => Promise<ArxModuleOptions> | ArxModuleOptions;
  inject?: unknown[];
  isGlobal?: boolean;
}
