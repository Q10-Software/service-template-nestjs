import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { CreatePetUseCase } from '@context/pets/application/useCases/createPet.useCase';
import { DeletePetUseCase } from '@context/pets/application/useCases/deletePet.useCase';
import { GetPetByIdUseCase } from '@context/pets/application/useCases/getPetById.useCase';
import { ListPetsUseCase } from '@context/pets/application/useCases/listPets.useCase';
import { UpdatePetUseCase } from '@context/pets/application/useCases/updatePet.useCase';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';

import { CreatePetBodyDto, PetResponseDto, UpdatePetBodyDto } from './pets.dto';
import { ResultCacheInterceptor } from '../../interceptors/resultCache.interceptor';
import { CacheInvalidate } from '../../decorators/cacheInvalidate.decorator';
import { CacheInvalidateInterceptor } from '../../interceptors/cacheInvalidate.interceptor';

@Controller('pets')
@UseInterceptors(ResultCacheInterceptor, CacheInvalidateInterceptor)
export class PetsController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly getPetByIdUseCase: GetPetByIdUseCase,
    private readonly listPetsUseCase: ListPetsUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
  ) {}

  @Post()
  @CacheInvalidate('/pets')
  create(@Body() body: CreatePetBodyDto): Promise<Result<PetResponseDto, DomainError>> {
    return this.createPetUseCase.execute(body);
  }

  @Get()
  findAll(): Promise<Result<PetResponseDto[], DomainError>> {
    return this.listPetsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Result<PetResponseDto, DomainError>> {
    return this.getPetByIdUseCase.execute({ id });
  }

  @Put(':id')
  @CacheInvalidate(
    '/pets',
    (ctx: ExecutionContext) => `/pets/${ctx.switchToHttp().getRequest<{ params: { id: string } }>().params.id}`,
  )
  update(
    @Param('id') id: string,
    @Body() body: UpdatePetBodyDto,
  ): Promise<Result<PetResponseDto, DomainError>> {
    return this.updatePetUseCase.execute({ id, ...body });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CacheInvalidate(
    '/pets',
    (ctx: ExecutionContext) => `/pets/${ctx.switchToHttp().getRequest<{ params: { id: string } }>().params.id}`,
  )
  remove(@Param('id') id: string): Promise<Result<void, DomainError>> {
    return this.deletePetUseCase.execute({ id });
  }
}
