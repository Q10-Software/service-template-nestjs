import 'dotenv/config'
import * as Sentry from '@sentry/nestjs'

function parseSampleRate(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback
  }
  const n = Number(value)
  if (!Number.isFinite(n)) {
    return fallback
  }
  return Math.min(1, Math.max(0, n))
}

function main(dsn: string | undefined) {
  if (!dsn) return

  Sentry.init({
    enableLogs: process.env.SENTRY_ENABLE_LOGS !== 'false',
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    release:
      process.env.APP_VERSION !== undefined && process.env.APP_VERSION !== ''
        ? `${process.env.APP_NAME ?? 'app'}@${process.env.APP_VERSION}`
        : undefined,
    tracesSampleRate: parseSampleRate(
      process.env.SENTRY_TRACES_SAMPLE_RATE,
      process.env.NODE_ENV === 'production' ? 0.2 : 1
    ),
    sendDefaultPii:
      process.env.SENTRY_SEND_DEFAULT_PII === 'true' ||
      process.env.SENTRY_SEND_DEFAULT_PII === '1'
  })
}

const dsn = process.env.SENTRY_DSN

main(dsn)
