export interface UpdatePetInput {
  id: string;
  name?: string;
  birthDate?: Date;
  breed?: string;
}

export interface UpdatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}
