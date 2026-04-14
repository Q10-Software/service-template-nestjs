import { DynamicModule, Module } from '@nestjs/common';
import { BuildPinoLoggerOptions } from '../../../infrastructure/adapters/pinoLogger.adapter';
import { LoggerService } from './logger.service';
import { RequestLoggingMiddleware } from './requestLogging.middleware';

export interface LoggerModuleOptions extends BuildPinoLoggerOptions {
  global: boolean;
  includeStack: boolean;
}

export interface LoggerModuleAsyncOptions {
  useFactory: (...args: any[]) => LoggerModuleOptions;
  global?: boolean;
  inject: any[];
  imports: any[];
}

@Module({})
export class LoggingModule {
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const loggerOptionsProvider = {
      provide: 'LOGGER_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject,
    };

    return {
      imports: options.imports,
      module: LoggingModule,
      global: options.global ?? true,
      providers: [
        loggerOptionsProvider,
        RequestLoggingMiddleware,
        {
          provide: LoggerService,
          useFactory: (options: LoggerModuleOptions) => {
            return new LoggerService(options, options.includeStack);
          },
          inject: ['LOGGER_OPTIONS'],
        },
      ],
      exports: [LoggerService, RequestLoggingMiddleware],
    };
  }
}
