import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { ArxService } from './arx.service';
import type { ArxModuleOptions } from './interfaces';
import { ARX_PERMISSIONS_KEY, ARX_ROLES_KEY } from './tokens';

/**
 * Guard that enforces @RequirePermissions() and @RequireRole() decorators.
 *
 * Register it globally via APP_GUARD, or apply it to specific controllers
 * and handlers.
 *
 * ArxGuard delegates error handling to the `onUnauthorized` and `onForbidden` hooks
 * in ArxModuleOptions. If the hooks are not configured, the guard returns `false`
 * and NestJS will respond with its default 403.
 *
 * @example — global registration (app.module.ts)
 * providers: [{ provide: APP_GUARD, useExisting: ArxGuard }]
 *
 * @example — per controller
 * \@UseGuards(ArxGuard)
 * \@Controller('posts')
 * export class PostsController { ... }
 */
export class ArxGuard implements CanActivate {
  constructor(
    private readonly arx: ArxService,
    private readonly reflector: Reflector,
    private readonly options: ArxModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[] | undefined>(
      ARX_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const roles = this.reflector.getAllAndOverride<string[] | undefined>(ARX_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Route has no arx decorators — allow through
    if (!permissions?.length && !roles?.length) return true;

    const request = context.switchToHttp().getRequest<Record<string, unknown>>();
    const userId = this.options.getUserId(request);

    if (!userId) {
      if (this.options.onUnauthorized) this.options.onUnauthorized(context);
      return false;
    }

    if (permissions?.length) {
      const allowed = await this.arx.canAll(userId, permissions);
      if (!allowed) {
        if (this.options.onForbidden) this.options.onForbidden(context);
        return false;
      }
    }

    if (roles?.length) {
      const checks = await Promise.all(roles.map((role) => this.arx.hasRole(userId, role)));
      if (!checks.some(Boolean)) {
        if (this.options.onForbidden) this.options.onForbidden(context);
        return false;
      }
    }

    return true;
  }
}
