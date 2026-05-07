import { DomainError } from './domainError'
import { DomainErrorProps } from './domainError.interfaces'
import { DomainErrorType } from './domainErrors.constants'

export type BaseErrorProps = Omit<DomainErrorProps, 'type'>

export interface ValidationErrorDetail {
  property: string
  value?: unknown
  errors?: string[]
  children?: ValidationErrorDetail[]
}

export class NotFoundError extends DomainError {
  readonly type = DomainErrorType.NOT_FOUND
  constructor(props: BaseErrorProps) {
    super({ ...props, type: DomainErrorType.NOT_FOUND })
  }
}

export class ConflictError extends DomainError {
  readonly type = DomainErrorType.CONFLICT
  constructor(props: BaseErrorProps) {
    super({ ...props, type: DomainErrorType.CONFLICT })
  }
}

export class ValidationError extends DomainError {
  readonly type = DomainErrorType.VALIDATION
  readonly details: ValidationErrorDetail[]

  constructor(props: BaseErrorProps, details: ValidationErrorDetail[] = []) {
    super({ ...props, type: DomainErrorType.VALIDATION })
    this.details = details
  }
}

export class UnknownError extends DomainError {
  readonly type = DomainErrorType.UNKNOWN
  constructor(props: BaseErrorProps) {
    super({ ...props, type: DomainErrorType.UNKNOWN })
  }
}
