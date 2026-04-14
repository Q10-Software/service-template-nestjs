import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export type ValidationOutputErrorItem = {
  property: string;
  messages: string[];
};

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationOutputErrorItem[] {
  const result: ValidationOutputErrorItem[] = [];
  for (const e of errors) {
    const path = parentPath ? `${parentPath}.${e.property}` : e.property;
    if (e.constraints && Object.keys(e.constraints).length) {
      result.push({ property: path, messages: Object.values(e.constraints) });
    }
    if (e.children?.length) {
      result.push(...flattenValidationErrors(e.children, path));
    }
  }
  return result;
}

export class ValidationOutputException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation output error',
        errors: flattenValidationErrors(errors),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
