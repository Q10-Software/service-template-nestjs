import { DOMAIN_ERROR_CODES } from "./domainErrors.constants";
import { DomainErrorProps } from "./domainError.interfaces";

export class DomainError extends Error
{
  public readonly code: DOMAIN_ERROR_CODES;
  public readonly context: string;
  public readonly message: string;
  public readonly attributes?: Record<string, unknown>;

  constructor(props: DomainErrorProps) {
    super(props.message);
    this.context = props.context;
    this.message = props.message;
    this.attributes = props.attributes;
    this.code = props.code;
  }
}
