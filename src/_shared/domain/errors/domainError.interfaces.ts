import { DomainErrorType } from './domainErrors.constants';

export interface DomainErrorProps {
  type: DomainErrorType;
  context: string;
  origin: string;
  message: string;
  attributes?: Record<string, unknown>;
}
