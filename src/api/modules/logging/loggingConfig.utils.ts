import { BuildPinoLoggerOptions } from '../../../infrastructure/adapters/pinoLogger.adapter';

export interface LoggerInfraConfig extends BuildPinoLoggerOptions {
  includeStack: boolean;
}

function toStringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function toBooleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((item) => typeof item === 'string' && item.length > 0)
    .map((item) => item as string);
}

export function normalizeLoggerConfig(raw: unknown): LoggerInfraConfig {
  const source = typeof raw === 'object' && raw !== null ? raw : {};
  const record = source as Record<string, unknown>;

  const includeStack = toBooleanValue(record.includeStack, true);

  return {
    service: toStringValue(record.service, 'app'),
    environment: toStringValue(record.environment, 'development'),
    version: typeof record.version === 'string' ? record.version : undefined,
    level: toStringValue(record.level, 'info'),
    pretty: toBooleanValue(record.pretty, false),
    includeStack,
    redactPaths: toStringArray(record.redactPaths, []),
  };
}
