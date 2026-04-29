import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DomainError } from '@shared/domain/errors/domainError';
import { ValidationError, ValidationErrorDetail } from '@shared/domain/errors/baseErrors';
import { DomainErrorType } from '@shared/domain/errors/domainErrors.constants';

const DOMAIN_ERROR_TO_HTTP_EXCEPTION: Record<
  DomainErrorType,
  new (body: Record<string, unknown>) => HttpException
> = {
  [DomainErrorType.NOT_FOUND]: NotFoundException,
  [DomainErrorType.CONFLICT]: ConflictException,
  [DomainErrorType.VALIDATION]: BadRequestException,
  [DomainErrorType.UNKNOWN]: InternalServerErrorException,
};

export interface DomainErrorHttpBody extends Record<string, unknown> {
  type: DomainErrorType;
  code: string;
  context: string;
  message: string;
  attributes?: Record<string, unknown>;
  details?: ValidationErrorDetail[];
}

export function domainErrorToHttpException(error: DomainError): HttpException {
  const ExceptionClass = DOMAIN_ERROR_TO_HTTP_EXCEPTION[error.type];

  const body: DomainErrorHttpBody = {
    type: error.type,
    code: error.code,
    context: error.context,
    message: error.message,
    details: error instanceof ValidationError ? error.details : undefined,
    ...(error.attributes && { attributes: error.attributes }),
  };

  return new ExceptionClass(body);
}
