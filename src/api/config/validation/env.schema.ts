import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_NAME: Joi.string(),
  PORT: Joi.number().port().default(3000),
  DEBUG: Joi.alternatives()
    .try(Joi.boolean(), Joi.string().valid('0', '1', 'true', 'false'))
    .default(false),
});
