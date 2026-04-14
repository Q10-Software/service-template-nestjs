import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PetsModule } from './pets/pets.module';
import { HealthModule } from './health/health.module';
import { ApiConfigModule } from '../config/config.module';
import { LoggingModule } from './logging/logging.module';
import { RequestLoggingMiddleware } from './logging/requestLogging.middleware';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { ConfigService } from '@nestjs/config';
import { ServiceInfoModule } from './serviceInfo/serviceInfo.module';
import { CacheConfig, LoggerConfig } from 'src/api/config/config.types';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ApiConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ApiConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cacheConfig = configService.getOrThrow<CacheConfig>('cache');

        return {
          stores: cacheConfig.redisUrl
            ? [new KeyvRedis(cacheConfig.redisUrl)]
            : undefined,
        };
      },
    }),
    SentryModule.forRoot(),
    LoggingModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<LoggerConfig>('logger');

        return {
          global: true,
          includeStack: false,
          serviceName: config.serviceName,
          environment: config.environment,
          serviceVersion: config.serviceVersion,
          level: config.level,
          pretty: config.pretty,
          redactPaths: config.redactPaths,
        };
      },
      inject: [ConfigService],
    }),
    PetsModule,
    ServiceInfoModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
