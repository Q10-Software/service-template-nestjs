import { ExecutionContext, SetMetadata } from '@nestjs/common';

export const CACHE_INVALIDATE_KEY = 'cache:invalidate';

export type CacheInvalidateKey = string | ((ctx: ExecutionContext) => string);

export const CacheInvalidate = (...keys: CacheInvalidateKey[]) =>
  SetMetadata(CACHE_INVALIDATE_KEY, keys);
