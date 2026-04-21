import { ConflictError, NotFoundError, ValidationError } from "./baseErrors";

export class DomainErrorFactory {
  public readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  notFound(message: string, attributes?: Record<string, unknown>) {
    return new NotFoundError({ context: this.context, message, attributes });
  }

  conflict(message: string, attributes?: Record<string, unknown>) {
    return new ConflictError({ context: this.context, message, attributes });
  }

  validation(message: string, attributes?: Record<string, unknown>) {
    return new ValidationError({ context: this.context, message, attributes });
  }
}