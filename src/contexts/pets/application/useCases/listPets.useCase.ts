import { AsyncUseCase } from '@shared/application/useCases/asyncUseCase.interface';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { ListPetsOutput } from './listPets.dto';

export class ListPetsUseCase implements AsyncUseCase<void, ListPetsOutput[]> {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(): Promise<Result<ListPetsOutput[], DomainError>> {
    const result = await this.petRepository.findAll();
    return Result.ok(result.value.map((aggregate) => ({
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    })));
  }
}
