import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './factories/app.config';
import httpConfig from './factories/http.config';
import loggerConfig from './factories/logger.config';
import cacheConfig from './factories/cache.config';
import { envSchema } from './validation/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, httpConfig, loggerConfig, cacheConfig],
      validationSchema: envSchema,
      cache: true,
      expandVariables: true,
    }),
  ],
  exports: [ConfigModule],
})
export class ApiConfigModule {}
