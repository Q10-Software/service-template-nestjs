import { NotFoundError, ValidationError } from '@shared/domain/errors/baseErrors';
import { PETS_DOMAIN_CONTEXT } from '../constants';

const context = PETS_DOMAIN_CONTEXT;

export const PetsErrorCode = {
  NOT_FOUND: 'PETS_NOT_FOUND',
  INVALID_NAME: 'PETS_INVALID_NAME',
  INVALID_BIRTH_DATE: 'PETS_INVALID_BIRTH_DATE',
  INVALID_BREED: 'PETS_INVALID_BREED',
} as const;

export type PetsErrorCode = typeof PetsErrorCode[keyof typeof PetsErrorCode];

export const petsErrors = {
  notFound: (origin: string, attributes?: Record<string, unknown>) =>
    new NotFoundError({
      context,
      code: PetsErrorCode.NOT_FOUND,
      origin,
      message: 'Pet not found',
      attributes,
    }),

  invalidName: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: PetsErrorCode.INVALID_NAME,
      origin,
      message: 'Invalid pet name',
      attributes,
    }),

  invalidBirthDate: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: PetsErrorCode.INVALID_BIRTH_DATE,
      origin,
      message: 'Invalid pet birth date',
      attributes,
    }),

  invalidBreed: (origin: string, attributes?: Record<string, unknown>) =>
    new ValidationError({
      context,
      code: PetsErrorCode.INVALID_BREED,
      origin,
      message: 'Invalid pet breed',
      attributes,
    }),
};
