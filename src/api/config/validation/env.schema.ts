import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_NAME: Joi.string(),
  APP_VERSION: Joi.string(),
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
});
