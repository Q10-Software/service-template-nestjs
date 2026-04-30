import { IPetRepository } from '@context/pets/domain/repositories/pet.repository';
import { PetAggregate } from '@context/pets/domain/aggregates/pet.aggregate';
import { PetName } from '@context/pets/domain/valueObjects/petName.vo';
import { PetBirthDate } from '@context/pets/domain/valueObjects/petBirthDate.vo';
import { PetBreed } from '@context/pets/domain/valueObjects/petBreed.vo';
import { RootMemoryRepository } from '../repositories/rootMemory.repository';
import { IPetDocument } from './petDocument.interface';
import { ICache } from '@infrastructure/interfaces/cache.interface';

export class PetMemoryRepository
  extends RootMemoryRepository<IPetDocument, PetAggregate>
  implements IPetRepository
{
  constructor(cache: ICache) {
    super(cache, 'PETS');
  }

  toDocument(aggregate: PetAggregate): IPetDocument {
    return {
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }

  toAggregate(document: IPetDocument): PetAggregate {
    const nameResult = PetName.create(document.name);
    const birthDateResult = PetBirthDate.create(document.birthDate);
    const breedResult = PetBreed.create(document.breed);

    if (nameResult.isFail || birthDateResult.isFail || breedResult.isFail) {
      throw new Error(`Data integrity error: invalid pet document [id=${document.id}]`);
    }

    return new PetAggregate({
      id: document.id,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      name: nameResult.value,
      birthDate: birthDateResult.value,
      breed: breedResult.value,
    });
  }
}
