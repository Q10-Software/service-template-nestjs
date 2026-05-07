import * as Joi from 'joi'

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  SERVICE_NAME: Joi.string(),
  SERVICE_VERSION: Joi.string(),
  PORT: Joi.number().port().default(3000),
  DEBUG: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid('0', '1', 'true', 'false'))
    .default(false),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .optional(),
  LOG_PRETTY: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid('0', '1', 'true', 'false'))
    .optional(),
  LOG_INCLUDE_STACK: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid('0', '1', 'true', 'false'))
    .optional(),
  LOG_REDACT_PATHS: Joi.string().optional(),
  SENTRY_DSN: Joi.string().uri().optional().allow(''),
  SENTRY_TRACES_SAMPLE_RATE: Joi.number().min(0).max(1).optional(),
  SENTRY_SEND_DEFAULT_PII: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid('0', '1', 'true', 'false'))
    .optional()
})
