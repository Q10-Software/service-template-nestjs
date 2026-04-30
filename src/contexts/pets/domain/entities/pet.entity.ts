import { IRootEntity } from '@shared/domain/interfaces/root.entity';
import { PetBirthDate } from '../valueObjects/petBirthDate.vo';
import { PetBreed } from '../valueObjects/petBreed.vo';
import { PetName } from '../valueObjects/petName.vo';

export interface IPet extends IRootEntity {
  name: PetName;
  birthDate: PetBirthDate;
  breed: PetBreed;
}

export interface CreatePetProps {
  name: string;
  birthDate: Date;
  breed: string;
}

export interface UpdatePetProps {
  name?: string;
  birthDate?: Date;
  breed?: string;
}
