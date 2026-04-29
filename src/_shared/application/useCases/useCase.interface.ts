import { DomainError } from "@shared/domain/errors/domainError";
import { Result } from "@shared/domain/result/result";

export interface UseCase<Input, Output> {
  execute(input: Input): Result<Output, DomainError> | void;
}
