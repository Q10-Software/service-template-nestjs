import {
  ConflictError,
  NotFoundError,
  UnknownError,
  ValidationError,
  ValidationErrorDetail,
} from './baseErrors';

export class DomainErrorFactory {
  constructor(private readonly context: string) {}

  notFound(message: string, origin: string, attributes?: Record<string, unknown>) {
    return new NotFoundError({ context: this.context, origin, message, attributes });
  }

  conflict(message: string, origin: string, attributes?: Record<string, unknown>) {
    return new ConflictError({ context: this.context, origin, message, attributes });
  }

  validation(message: string, origin: string, details: ValidationErrorDetail[] = [], attributes?: Record<string, unknown>) {
    return new ValidationError({ context: this.context, origin, message, attributes }, details);
  }

  unknown(message: string, origin: string, attributes?: Record<string, unknown>) {
    return new UnknownError({ context: this.context, origin, message, attributes });
  }
}
