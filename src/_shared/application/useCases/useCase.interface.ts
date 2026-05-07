import { DomainError } from '@shared/domain/errors/domainError'
import { Result } from '@shared/domain/result/result'

export interface UseCase<Input = void, Output = void> {
  execute(input: Input): Result<Output, DomainError>
}
