import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { petsErrors } from '../errors/pets.errors';

const ORIGIN = 'PetBirthDate.create';

export class PetBirthDate extends ValueObject<Date> {
  private constructor(value: Date) {
    super(value);
  }

  static create(value: Date): Result<PetBirthDate> {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return Result.fail(petsErrors.invalidBirthDate(ORIGIN, { reason: 'birthDate must be a valid date' }));
    }
    if (value > new Date()) {
      return Result.fail(petsErrors.invalidBirthDate(ORIGIN, { reason: 'birthDate cannot be in the future' }));
    }
    return Result.ok(new PetBirthDate(value));
  }
}
