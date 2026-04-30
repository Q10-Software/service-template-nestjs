import { AsyncUseCase } from '@shared/application/useCases/asyncUseCase.interface';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { PetAggregate } from '../../domain/aggregates/pet.aggregate';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { CreatePetInput, CreatePetOutput } from './createPet.dto';

export class CreatePetUseCase implements AsyncUseCase<CreatePetInput, CreatePetOutput> {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: CreatePetInput): Promise<Result<CreatePetOutput, DomainError>> {
    const aggregateResult = PetAggregate.create(input);
    if (aggregateResult.isFail) return Result.fail(aggregateResult.error);

    const savedResult = await this.petRepository.create(aggregateResult.value);
    if (savedResult.isFail) return Result.fail(savedResult.error);

    const saved = savedResult.value;
    return Result.ok({
      id: saved.id,
      name: saved.name,
      birthDate: saved.birthDate,
      breed: saved.breed,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }
}
