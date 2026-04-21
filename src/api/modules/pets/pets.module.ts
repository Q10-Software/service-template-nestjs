import { Module } from '@nestjs/common';

import { CreatePetUseCase } from '@context/pets/application/useCases/createPet.useCase';
import { DeletePetUseCase } from '@context/pets/application/useCases/deletePet.useCase';
import { GetPetByIdUseCase } from '@context/pets/application/useCases/getPetById.useCase';
import { ListPetsUseCase } from '@context/pets/application/useCases/listPets.useCase';
import { UpdatePetUseCase } from '@context/pets/application/useCases/updatePet.useCase';
import { PetMemoryRepository } from '@infrastructure/persistence/pets/petMemory.repository';

import { PetsController } from './pets.controller';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ICache } from '@infrastructure/interfaces/cache.interface';
import { CacheInvalidateInterceptor } from '../../interceptors/cacheInvalidate.interceptor';

@Module({
  controllers: [PetsController],
  providers: [
    {
      provide: PetMemoryRepository,
      useFactory: (cache: ICache) => new PetMemoryRepository(cache),
      inject: [CACHE_MANAGER],
    },
    {
      provide: CreatePetUseCase,
      useFactory: (repo: PetMemoryRepository) => new CreatePetUseCase(repo),
      inject: [PetMemoryRepository],
    },
    {
      provide: GetPetByIdUseCase,
      useFactory: (repo: PetMemoryRepository) => new GetPetByIdUseCase(repo),
      inject: [PetMemoryRepository],
    },
    {
      provide: ListPetsUseCase,
      useFactory: (repo: PetMemoryRepository) => new ListPetsUseCase(repo),
      inject: [PetMemoryRepository],
    },
    {
      provide: UpdatePetUseCase,
      useFactory: (repo: PetMemoryRepository) => new UpdatePetUseCase(repo),
      inject: [PetMemoryRepository],
    },
    {
      provide: DeletePetUseCase,
      useFactory: (repo: PetMemoryRepository) => new DeletePetUseCase(repo),
      inject: [PetMemoryRepository],
    },
    CacheInvalidateInterceptor,
  ],
})
export class PetsModule {}
