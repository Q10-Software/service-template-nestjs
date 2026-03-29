import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePetUseCase } from '@context/pets/application/useCases/createPet.useCase';
import { DeletePetUseCase } from '@context/pets/application/useCases/deletePet.useCase';
import { GetPetByIdUseCase } from '@context/pets/application/useCases/getPetById.useCase';
import { ListPetsUseCase } from '@context/pets/application/useCases/listPets.useCase';
import { UpdatePetUseCase } from '@context/pets/application/useCases/updatePet.useCase';

import { CreatePetBodyDto, PetResponseDto, UpdatePetBodyDto } from './pets.dto';

@Controller('pets')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class PetsController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly getPetByIdUseCase: GetPetByIdUseCase,
    private readonly listPetsUseCase: ListPetsUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
  ) {}

  @Post()
  create(@Body() body: CreatePetBodyDto): PetResponseDto {
    const result = this.createPetUseCase.execute({
      name: body.name,
      birthDate: body.birthDate,
      breed: body.breed,
    });
    return {
      id: result.id,
      name: result.name,
      birthDate: result.birthDate,
      breed: result.breed,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get()
  findAll(): PetResponseDto[] {
    const pets = this.listPetsUseCase.execute();
    return pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      birthDate: pet.birthDate,
      breed: pet.breed,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string): PetResponseDto {
    const pet = this.getPetByIdUseCase.execute({ id });
    if (!pet) {
      throw new NotFoundException(`Pet with id ${id} not found`);
    }
    return {
      id: pet.id,
      name: pet.name,
      birthDate: pet.birthDate,
      breed: pet.breed,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdatePetBodyDto,
  ): PetResponseDto {
    const pet = this.updatePetUseCase.execute({
      id,
      name: body.name,
      birthDate: body.birthDate,
      breed: body.breed,
    });

    if (!pet) {
      throw new NotFoundException(`Pet with id ${id} not found`);
    }

    return {
      id: pet.id,
      name: pet.name,
      birthDate: pet.birthDate,
      breed: pet.breed,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    const deleted = this.deletePetUseCase.execute({ id });
    if (!deleted) {
      throw new NotFoundException(`Pet with id ${id} not found`);
    }
  }
}
