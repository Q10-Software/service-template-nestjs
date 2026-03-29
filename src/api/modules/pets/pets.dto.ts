import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePetBodyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  @IsNotEmpty()
  breed!: string;
}

export class UpdatePetBodyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  @IsNotEmpty()
  breed!: string;
}

export class PetResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  breed!: string;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
