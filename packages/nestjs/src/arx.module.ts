import { type DynamicModule, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ArxGuard } from './arx.guard';
import { ArxService } from './arx.service';
import type { ArxModuleAsyncOptions, ArxModuleOptions } from './interfaces';
import { ARX_MODULE_OPTIONS } from './tokens';

/**
 * NestJS module for @arxjs/core.
 *
 * Provides ArxService and ArxGuard across your application.
 * By default the module is global — import it once in AppModule.
 *
 * @example — static configuration
 * ArxModule.forRoot({
 *   adapter: new PrismaAdapter(prisma),
 *   getUserId: (req) => req.user?.id,
 * })
 *
 * @example — async configuration (e.g. depends on ConfigService)
 * ArxModule.forRootAsync({
 *   inject: [ConfigService],
 *   useFactory: (config: ConfigService) => ({
 *     adapter: new PrismaAdapter(prisma),
 *     getUserId: (req) => req.user?.id,
 *   }),
 * })
 */
@Module({})
export class ArxModule {
  static forRoot(options: ArxModuleOptions): DynamicModule {
    return {
      module: ArxModule,
      global: options.isGlobal ?? true,
      providers: [
        Reflector,
        {
          provide: ARX_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: ArxService,
          useFactory: (opts: ArxModuleOptions) => new ArxService(opts),
          inject: [ARX_MODULE_OPTIONS],
        },
        {
          provide: ArxGuard,
          useFactory: (service: ArxService, reflector: Reflector, opts: ArxModuleOptions) =>
            new ArxGuard(service, reflector, opts),
          inject: [ArxService, Reflector, ARX_MODULE_OPTIONS],
        },
      ],
      exports: [ArxService, ArxGuard],
    };
  }

  static forRootAsync<TArgs extends unknown[] = unknown[]>(
    options: ArxModuleAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: ArxModule,
      global: options.isGlobal ?? true,
      providers: [
        Reflector,
        {
          provide: ARX_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: (options.inject ?? []) as never[],
        },
        {
          provide: ArxService,
          useFactory: (opts: ArxModuleOptions) => new ArxService(opts),
          inject: [ARX_MODULE_OPTIONS],
        },
        {
          provide: ArxGuard,
          useFactory: (service: ArxService, reflector: Reflector, opts: ArxModuleOptions) =>
            new ArxGuard(service, reflector, opts),
          inject: [ArxService, Reflector, ARX_MODULE_OPTIONS],
        },
      ],
      exports: [ArxService, ArxGuard],
    };
  }
}
