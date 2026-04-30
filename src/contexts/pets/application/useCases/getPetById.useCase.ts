import { AsyncUseCase } from '@shared/application/useCases/asyncUseCase.interface';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { GetPetByIdInput, GetPetByIdOutput } from './getPetById.dto';

const ORIGIN = 'GetPetByIdUseCase.execute';

export class GetPetByIdUseCase implements AsyncUseCase<GetPetByIdInput, GetPetByIdOutput> {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: GetPetByIdInput): Promise<Result<GetPetByIdOutput, DomainError>> {
    const result = await this.petRepository.findById(input.id);
    if (result.isFail) return Result.fail(result.error);

    const aggregate = result.value;
    return Result.ok({
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    });
  }
}
