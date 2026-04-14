import { ConfigType } from '@nestjs/config';
import appConfig from './factories/app.config';
import httpConfig from './factories/http.config';
import loggerConfig from './factories/logger.config';
import cacheConfig from './factories/cache.config';

export type AppConfig = ConfigType<typeof appConfig>;
export type HttpConfig = ConfigType<typeof httpConfig>;
export type LoggerConfig = ConfigType<typeof loggerConfig>;
export type CacheConfig = ConfigType<typeof cacheConfig>;
