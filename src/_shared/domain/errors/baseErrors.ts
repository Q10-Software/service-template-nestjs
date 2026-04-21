import { DomainError } from './domainError';
import { DomainErrorProps } from './domainError.interfaces';
import { DOMAIN_ERROR_CODES } from './domainErrors.constants';

export type BaseErrorProps = Omit<DomainErrorProps, 'code'>;

export class NotFoundError extends DomainError {
  readonly code: DOMAIN_ERROR_CODES = DOMAIN_ERROR_CODES.NOT_FOUND;
  constructor(props: BaseErrorProps) {
    super({ code: DOMAIN_ERROR_CODES.NOT_FOUND, ...props });
  }
}

export class ConflictError extends DomainError {
  readonly code: DOMAIN_ERROR_CODES = DOMAIN_ERROR_CODES.CONFLICT;
  constructor(props: BaseErrorProps) {
    super({ code: DOMAIN_ERROR_CODES.CONFLICT, ...props });
  }
}

export class ValidationError extends DomainError {
  readonly code: DOMAIN_ERROR_CODES = DOMAIN_ERROR_CODES.VALIDATION;
  constructor(props: BaseErrorProps) {
    super({ code: DOMAIN_ERROR_CODES.VALIDATION, ...props });
  }
}

export class UnknownError extends DomainError {
  readonly code: DOMAIN_ERROR_CODES = DOMAIN_ERROR_CODES.UNKNOWN_ERROR;
  constructor(props: BaseErrorProps) {
    super({ code: DOMAIN_ERROR_CODES.UNKNOWN_ERROR, ...props });
  }
}