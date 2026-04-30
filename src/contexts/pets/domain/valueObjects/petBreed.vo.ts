import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { petsErrors } from '../errors/pets.errors';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;
const ORIGIN = 'PetBreed.create';

export class PetBreed extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): Result<PetBreed> {
    if (!value || value.trim().length < MIN_LENGTH) {
      return Result.fail(petsErrors.invalidBreed(ORIGIN, { value, reason: 'Breed is required' }));
    }
    if (value.trim().length > MAX_LENGTH) {
      return Result.fail(petsErrors.invalidBreed(ORIGIN, { value, reason: `Breed must be at most ${MAX_LENGTH} characters` }));
    }
    return Result.ok(new PetBreed(value.trim()));
  }
}
