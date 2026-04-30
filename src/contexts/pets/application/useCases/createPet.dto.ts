export interface CreatePetInput {
  name: string;
  birthDate: Date;
  breed: string;
}

export interface CreatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}
