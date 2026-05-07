import { DomainError } from '@shared/domain/errors/domainError'
import { Result } from '@shared/domain/result/result'

export interface AsyncUseCase<Input = void, Output = void> {
  execute(input: Input): Promise<Result<Output, DomainError>>
}
