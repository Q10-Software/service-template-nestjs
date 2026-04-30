import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { petsErrors } from '../errors/pets.errors';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;
const ORIGIN = 'PetName.create';

export class PetName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): Result<PetName> {
    if (!value || value.trim().length < MIN_LENGTH) {
      return Result.fail(petsErrors.invalidName(ORIGIN, { value, reason: 'Name is required' }));
    }
    if (value.trim().length > MAX_LENGTH) {
      return Result.fail(petsErrors.invalidName(ORIGIN, { value, reason: `Name must be at most ${MAX_LENGTH} characters` }));
    }
    return Result.ok(new PetName(value.trim()));
  }
}
