import { DomainErrorType } from './domainErrors.constants';
import { DomainErrorProps } from './domainError.interfaces';

export class DomainError extends Error {
  public readonly type: DomainErrorType;
  public readonly code: string;
  public readonly context: string;
  public readonly origin: string;
  public readonly message: string;
  public readonly attributes?: Record<string, unknown>;

  constructor(props: DomainErrorProps) {
    super(props.message);
    this.type = props.type;
    this.code = props.code;
    this.context = props.context;
    this.origin = props.origin;
    this.message = props.message;
    this.attributes = props.attributes;
  }
}
