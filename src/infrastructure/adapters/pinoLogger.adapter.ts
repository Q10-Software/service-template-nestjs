import pino, { Logger as PinoLogger } from 'pino';
import {
  IAppLoggerPort,
  LogContext,
} from '../../contexts/_shared/application/ports/logger.port';

export interface BuildPinoLoggerOptions {
  service: string;
  environment: string;
  version?: string;
  level: string;
  pretty: boolean;
  includeStack: boolean;
  redactPaths: string[];
}

export class PinoLoggerAdapter implements IAppLoggerPort {
  constructor(
    private readonly logger: PinoLogger,
    private readonly includeStack: boolean,
  ) {}

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
    this.logger.info(this.toPayload(context), message);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.toPayload(context), message);
  }

  trace(message: string, context?: LogContext): void {
    this.logger.trace(this.toPayload(context), message);
  }

  child(bindings: Omit<LogContext, 'error' | 'http' | 'meta'>): IAppLoggerPort {
    return new PinoLoggerAdapter(
      this.logger.child(this.toPayload(bindings)),
      this.includeStack,
    );
  }

  private toPayload(context?: LogContext): Record<string, unknown> {
    if (!context) {
      return {};
    }

    const error = context.error
      ? {
          name: context.error.name,
          message: context.error.message,
          stack: this.includeStack ? context.error.stack : undefined,
        }
      : undefined;

    return {
      event: context.event,
      context: context.context,
      request_id: context.requestId,
      trace_id: context.traceId,
      span_id: context.spanId,
      user_id: context.userId,
      http: context.http
        ? {
            method: context.http.method,
            route: context.http.route,
            status_code: context.http.statusCode,
            latency_ms: context.http.latencyMs,
          }
        : undefined,
      error,
      meta: context.meta,
    };
  }

  static build(options: BuildPinoLoggerOptions): PinoLogger {
    return pino({
      level: options.level,
      base: {
        service: options.service,
        environment: options.environment,
        version: options.version ?? '0.0.0',
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
