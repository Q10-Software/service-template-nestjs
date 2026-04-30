import { AsyncUseCase } from '@shared/application/useCases/asyncUseCase.interface';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { UpdatePetInput, UpdatePetOutput } from './updatePet.dto';

export class UpdatePetUseCase implements AsyncUseCase<UpdatePetInput, UpdatePetOutput> {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: UpdatePetInput): Promise<Result<UpdatePetOutput, DomainError>> {
    const existingResult = await this.petRepository.findById(input.id);
    if (existingResult.isFail) return Result.fail(existingResult.error);

    const updatedResult = existingResult.value.update({
      name: input.name,
      birthDate: input.birthDate,
      breed: input.breed,
    });
    if (updatedResult.isFail) return Result.fail(updatedResult.error);

    const savedResult = await this.petRepository.update(updatedResult.value);
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
