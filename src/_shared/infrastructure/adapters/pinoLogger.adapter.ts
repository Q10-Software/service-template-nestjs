import pino, { Logger as PinoLogger } from 'pino';
import {
  IAppLoggerPort,
  LogContext,
} from '@shared/application/ports/logger.port';
import * as Sentry from '@sentry/nestjs';

export interface BuildPinoLoggerOptions {
  serviceName: string;
  environment: string;
  serviceVersion: string;
  level: string;
  pretty: boolean;
  includeStack?: boolean;
  redactPaths: string[];
  context?: string;
}

export class PinoLoggerAdapter implements IAppLoggerPort {
  private readonly logger: PinoLogger;

  constructor(
    private readonly options: BuildPinoLoggerOptions,
    private readonly includeStack: boolean,
  ) {
    this.options = options;
    this.logger = this.build(options);
  }

  fatal(message: string, context?: LogContext): void {
    this.logger.fatal(this.toPayload(context), message);
  }

  error(message: string, context?: LogContext): void {
    this.logger.error(this.toPayload(context), message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.toPayload(context), message);
  }

  info(message: string, context?: LogContext): void {
    const payload = this.toPayload(context);
    this.logger.info(payload, message);
    Sentry.logger.info(message, { context: payload });
  }
  
  log(message: string, context?: LogContext): void {
    const payload = this.toPayload(context);
    this.logger.info(payload, message);
    Sentry.logger.info(message, { context: payload });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.toPayload(context), message);
  }

  trace(message: string, context?: LogContext): void {
    this.logger.trace(this.toPayload(context), message);
  }

  setContext(context: string): IAppLoggerPort {
    return new PinoLoggerAdapter({
      ...this.options,
      context,
    }, this.includeStack);
  }

  private toPayload(context?: LogContext | string): Record<string, unknown> {
    if (!context) {
      return {};
    }

    if (typeof context === 'string') {
      context = {
        context,
      };
    }

    const error = context.error
      ? {
          name: context.error.name,
          message: context.error.message,
          stack: this.includeStack ? context.error.stack : undefined,
          context: context.context,
        }
      : undefined;

    return {
      event: context.event,
      context: context.context,
      requestId: context.requestId,
      traceId: context.traceId,
      spanId: context.spanId,
      userId: context.userId,
      http: context.http
        ? {
            method: context.http.method,
            route: context.http.route,
            statusCode: context.http.statusCode,
            latencyMs: context.http.latencyMs,
          }
        : undefined,
      error,
      meta: context.meta,
    };
  }

  private build(options: BuildPinoLoggerOptions): PinoLogger {
    return pino({
      level: options.level,
      base: {
        serviceName: options.serviceName ?? 'unknown',
        environment: options.environment,
        version: '0.0.1',
        serviceVersion: options.serviceVersion ?? 'unknown',
        context: options.context,
      },
      redact: {
        paths: options.redactPaths,
        censor: '[REDACTED]',
      },
      formatters: {
        level: (label) => ({ level: label }),
      },
      transport: options.pretty
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              singleLine: true,
            },
          }
        : undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }
}
