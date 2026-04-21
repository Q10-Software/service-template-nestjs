import { DOMAIN_ERROR_CODES } from "./domainErrors.constants";

export interface DomainErrorProps {
    code: DOMAIN_ERROR_CODES;
    context: string;
    message: string;
    attributes?: Record<string, unknown>;
  }