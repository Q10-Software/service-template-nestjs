import { AsyncUseCase } from '@shared/application/useCases/asyncUseCase.interface';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { DeletePetInput } from './deletePet.dto';

export class DeletePetUseCase implements AsyncUseCase<DeletePetInput, void> {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: DeletePetInput): Promise<Result<void, DomainError>> {
    const result = await this.petRepository.delete(input.id);
    if (result.isFail) return Result.fail(result.error);
    return Result.ok(undefined as void);
  }
}
