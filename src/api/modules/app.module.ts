import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppInfoModule } from './appInfo/appInfo.module';
import { PetsModule } from './pets/pets.module';
import { HealthModule } from './health/health.module';
import { ApiConfigModule } from '../config/config.module';
import { LoggingModule } from './logging/logging.module';
import { RequestLoggingMiddleware } from './logging/requestLogging.middleware';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { ConfigService } from '@nestjs/config';
import { LoggerConfig } from 'src/api/config/config.types';

@Module({
  imports: [
    SentryModule.forRoot(),
    ApiConfigModule,
    LoggingModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<LoggerConfig>('logger');

        return {
          global: true,
          includeStack: false,
          service: config.service,
          environment: config?.environment,
          version: config?.version,
          level: config?.level,
          pretty: config?.pretty,
          redactPaths: config?.redactPaths,
        };
      },
      inject: [ConfigService],
    }),
    AppInfoModule,
    PetsModule,
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
