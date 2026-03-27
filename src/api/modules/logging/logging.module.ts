import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_LOGGER_PORT } from '../../../contexts/_shared/application/ports/logger.port';
import { PinoLoggerAdapter } from '../../../infrastructure/adapters/pinoLogger.adapter';
import { LoggerService } from './logger.service';
import { normalizeLoggerConfig } from './loggingConfig.utils';
import { RequestLoggingMiddleware } from './requestLogging.middleware';

@Module({
  providers: [
    {
      provide: APP_LOGGER_PORT,
      useFactory: (configService: ConfigService) => {
        const loggerConfig = normalizeLoggerConfig(configService.get('logger'));

        const logger = PinoLoggerAdapter.build({
          service: loggerConfig.service,
          environment: loggerConfig.environment,
          version: loggerConfig.version,
          level: loggerConfig.level,
          pretty: loggerConfig.pretty,
          includeStack: loggerConfig.includeStack,
          redactPaths: loggerConfig.redactPaths,
        });

        return new PinoLoggerAdapter(
          logger,
          Boolean(loggerConfig.includeStack),
        );
      },
      inject: [ConfigService],
    },
    LoggerService,
    RequestLoggingMiddleware,
  ],
  exports: [APP_LOGGER_PORT, LoggerService, RequestLoggingMiddleware],
})
export class LoggingModule {}
