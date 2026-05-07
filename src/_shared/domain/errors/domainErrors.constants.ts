export const DomainErrorType = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN'
} as const

export type DomainErrorType =
  (typeof DomainErrorType)[keyof typeof DomainErrorType]
