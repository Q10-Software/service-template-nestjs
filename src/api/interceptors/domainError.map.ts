import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DomainError } from '@shared/domain/errors/domainError';
import { DOMAIN_ERROR_CODES } from '@shared/domain/errors/domainErrors.constants';

const DOMAIN_ERROR_TO_HTTP_EXCEPTION: Record<
  DOMAIN_ERROR_CODES,
  new (message: string) => HttpException
> = {
  [DOMAIN_ERROR_CODES.NOT_FOUND]: NotFoundException,
  [DOMAIN_ERROR_CODES.CONFLICT]: ConflictException,
  [DOMAIN_ERROR_CODES.VALIDATION]: BadRequestException,
  [DOMAIN_ERROR_CODES.UNKNOWN_ERROR]: InternalServerErrorException,
};

export function domainErrorToHttpException(error: DomainError): HttpException {
  const ExceptionClass = DOMAIN_ERROR_TO_HTTP_EXCEPTION[error.code];
  return new ExceptionClass(error.message);
}
