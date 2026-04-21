import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Result } from '@shared/domain/result/result';
import { CACHE_INVALIDATE_KEY, CacheInvalidateKey } from '../decorators/cacheInvalidate.decorator';

@Injectable()
export class CacheInvalidateInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const keys =
      this.reflector.get<CacheInvalidateKey[]>(CACHE_INVALIDATE_KEY, context.getHandler()) ?? [];

    return next.handle().pipe(
      tap(async (result) => {
        if (result instanceof Result && result.isFail) return;

        const resolvedKeys = keys.map((key) =>
          typeof key === 'function' ? key(context) : key,
        );

        Promise.all(resolvedKeys.map((key) => this.cacheManager.del(key)));
      }),
    );
  }
}
