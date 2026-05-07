import { DomainErrorType } from './domainErrors.constants'

export interface DomainErrorProps {
  type: DomainErrorType
  code: string
  context: string
  origin: string
  message: string
  attributes?: Record<string, unknown>
}
