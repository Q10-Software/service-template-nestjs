import {
  NotFoundError,
  UnknownError,
  ValidationError,
  ValidationErrorDetail
} from '@shared/domain/errors/baseErrors'

const context = 'serviceInfo'

export const ServiceInfoErrorCode = {
  NOT_FOUND: 'SERVICE_INFO_NOT_FOUND',
  UNAVAILABLE: 'SERVICE_INFO_UNAVAILABLE',
  MAPPER_VALIDATION: 'SERVICE_INFO_MAPPER_VALIDATION_FAILED',
  INVALID_STATUS: 'SERVICE_INFO_INVALID_STATUS',
  INVALID_NAME: 'SERVICE_INFO_INVALID_NAME',
  INVALID_VERSION: 'SERVICE_INFO_INVALID_VERSION',
  INVALID_STARTED_AT: 'SERVICE_INFO_INVALID_STARTED_AT'
} as const

export type ServiceInfoErrorCode =
  (typeof ServiceInfoErrorCode)[keyof typeof ServiceInfoErrorCode]

export const serviceInfoErrors = {
  notFound: ({
    origin,
    attributes = {}
  }: {
    origin: string
    attributes?: Record<string, unknown>
  }) =>
    new NotFoundError({
      context,
      code: ServiceInfoErrorCode.NOT_FOUND,
      origin,
      message: 'Service info not found',
      attributes
    }),

  unavailable: ({
    origin,
    attributes = {}
  }: {
    origin: string
    attributes?: Record<string, unknown>
  }) =>
    new UnknownError({
      context,
      code: ServiceInfoErrorCode.UNAVAILABLE,
      origin,
      message: 'Service info is unavailable',
      attributes
    }),

  mapperValidation: ({
    origin,
    details = [],
    attributes = {}
  }: {
    origin: string
    details?: ValidationErrorDetail[]
    attributes?: Record<string, unknown>
  }) =>
    new ValidationError(
      {
        context,
        code: ServiceInfoErrorCode.MAPPER_VALIDATION,
        origin,
        message: 'Validation failed',
        attributes
      },
      details
    ),

  invalidStatus: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: ServiceInfoErrorCode.INVALID_STATUS,
      origin,
      message: 'Invalid service status',
      attributes
    }),

  invalidName: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: ServiceInfoErrorCode.INVALID_NAME,
      origin,
      message: 'Invalid service name',
      attributes
    }),

  invalidVersion: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: ServiceInfoErrorCode.INVALID_VERSION,
      origin,
      message: 'Invalid service version',
      attributes
    }),

  invalidStartedAt: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: ServiceInfoErrorCode.INVALID_STARTED_AT,
      origin,
      message: 'Invalid service startedAt date',
      attributes
    })
}
