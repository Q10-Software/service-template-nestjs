import { UnknownError, ValidationError, ValidationErrorDetail } from '@shared/domain/errors/baseErrors';

export const HealthContext = 'health';

export const HealthErrorCode = {
  CHECK_FAILED: 'HEALTH_CHECK_FAILED',
  VALIDATION: 'HEALTH_VALIDATION_FAILED',
} as const;

export type HealthErrorCode = typeof HealthErrorCode[keyof typeof HealthErrorCode];

export const healthErrors = {
  checkFailed: (origin: string, attributes?: Record<string, unknown>) =>
    new UnknownError({
      context: HealthContext,
      code: HealthErrorCode.CHECK_FAILED,
      origin,
      message: 'Health check failed',
      attributes,
    }),

  validation: (origin: string, details: ValidationErrorDetail[] = [], attributes?: Record<string, unknown>) =>
    new ValidationError({
      context: HealthContext,
      code: HealthErrorCode.VALIDATION,
      origin,
      message: 'Health validation failed',
      attributes,
    }, details),
};
