export const APP_LOGGER_PORT = Symbol('APP_LOGGER_PORT');

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface HttpLogContext {
  method?: string;
  route?: string;
  statusCode?: number;
  latencyMs?: number;
}

export interface LogErrorContext {
  name?: string;
  message?: string;
  stack?: string;
}

export interface LogContext {
  event?: string;
  context?: string;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  http?: HttpLogContext;
  error?: LogErrorContext;
  meta?: Record<string, unknown>;
}

export interface IAppLoggerPort {
  fatal(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  trace(message: string, context?: LogContext): void;
  child(bindings: Omit<LogContext, 'error' | 'http' | 'meta'>): IAppLoggerPort;
}
