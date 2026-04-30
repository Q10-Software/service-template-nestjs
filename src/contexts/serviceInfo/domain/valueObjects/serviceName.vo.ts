import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { serviceInfoErrors } from '../errors/serviceInfo.errors';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class ServiceName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string, origin: string): Result<ServiceName> {
    if (!value || value.trim().length < MIN_LENGTH) {
      return Result.fail(
        serviceInfoErrors.invalidName(origin, { value, reason: 'Name is required' }),
      );
    }

    if (value.trim().length > MAX_LENGTH) {
      return Result.fail(
        serviceInfoErrors.invalidName(origin, { value, reason: `Name must be at most ${MAX_LENGTH} characters` }),
      );
    }

    return Result.ok(new ServiceName(value.trim()));
  }
}
