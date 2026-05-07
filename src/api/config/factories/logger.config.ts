import { registerAs } from '@nestjs/config'

function toBoolean(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback
  return value === '1' || value.toLowerCase() === 'true'
}

function toList(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export default registerAs('logger', () => {
  const debug = toBoolean(process.env.DEBUG, false)
  const environment = process.env.NODE_ENV ?? 'development'
  const defaultLevel = debug ? 'debug' : 'info'

  return {
    serviceName: process.env.SERVICE_NAME ?? 'unknown',
    environment,
    serviceVersion: process.env.SERVICE_VERSION ?? 'unknown',
    level: process.env.LOG_LEVEL ?? defaultLevel,
    pretty: toBoolean(process.env.LOG_PRETTY, environment !== 'production'),
    includeStack: toBoolean(
      process.env.LOG_INCLUDE_STACK,
      environment !== 'production'
    ),
    redactPaths: toList(process.env.LOG_REDACT_PATHS, [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'password',
      'token',
      'accessToken',
      'refreshToken'
    ])
  }
})
