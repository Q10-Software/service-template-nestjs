export interface GetPetByIdInput {
  id: string;
}

export interface GetPetByIdOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}
