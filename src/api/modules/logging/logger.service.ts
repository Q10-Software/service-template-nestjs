import {
  Inject,
  Injectable,
  LoggerService as ILoggerService,
} from '@nestjs/common';
import {
  APP_LOGGER_PORT,
  LogContext,
} from '../../../contexts/_shared/application/ports/logger.port';
import type { IAppLoggerPort } from '../../../contexts/_shared/application/ports/logger.port';

@Injectable()
export class LoggerService implements ILoggerService {
  constructor(
    @Inject(APP_LOGGER_PORT)
    private readonly appLogger: IAppLoggerPort,
  ) {}

  log(message: unknown, context?: string): void {
    this.appLogger.info(this.toMessage(message), this.toContext(context));
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.appLogger.error(this.toMessage(message), {
      ...this.toContext(context),
      error: {
        message: this.toMessage(message),
        stack: trace,
      },
    });
  }

  warn(message: unknown, context?: string): void {
    this.appLogger.warn(this.toMessage(message), this.toContext(context));
  }

  debug(message: unknown, context?: string): void {
    this.appLogger.debug(this.toMessage(message), this.toContext(context));
  }

  verbose(message: unknown, context?: string): void {
    this.appLogger.trace(this.toMessage(message), this.toContext(context));
  }

  fatal(message: unknown, trace?: string, context?: string): void {
    this.appLogger.fatal(this.toMessage(message), {
      ...this.toContext(context),
      error: {
        message: this.toMessage(message),
        stack: trace,
      },
    });
  }

  private toMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    if (message instanceof Error) {
      return message.message;
    }

    return JSON.stringify(message);
  }

  private toContext(context?: string): LogContext | undefined {
    if (!context) {
      return undefined;
    }

    return { context };
  }
}
