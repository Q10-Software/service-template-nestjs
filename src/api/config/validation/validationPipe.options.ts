import { BadRequestException, ValidationPipeOptions } from '@nestjs/common'
import { ValidationError as ClassValidatorError } from 'class-validator'
import { ValidationErrorDetail } from '@shared/domain/errors/baseErrors'
import { DomainErrorType } from '@shared/domain/errors/domainErrors.constants'

function toValidationErrorDetail(
  error: ClassValidatorError
): ValidationErrorDetail {
  const detail: ValidationErrorDetail = {
    property: error.property,
    value: error.value
  }

  if (error.constraints) {
    detail.errors = Object.values(error.constraints)
  }

  if (error.children && error.children.length > 0) {
    detail.children = error.children.map(toValidationErrorDetail)
  }

  return detail
}

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  exceptionFactory: (errors: ClassValidatorError[] = []) =>
    new BadRequestException({
      type: DomainErrorType.VALIDATION,
      code: `HTTP.${DomainErrorType.VALIDATION}`,
      message: 'Validation failed',
      details: errors.map(toValidationErrorDetail)
    })
}
