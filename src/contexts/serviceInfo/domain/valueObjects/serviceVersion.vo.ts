import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { serviceInfoErrors } from '../errors/serviceInfo.errors';

// Expects semver format: 1.0.0
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

export class ServiceVersion extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string, origin: string): Result<ServiceVersion> {
    if (!value || !SEMVER_REGEX.test(value)) {
      return Result.fail(
        serviceInfoErrors.invalidVersion(origin, { value, reason: 'Version must follow semver format (e.g. 1.0.0)' }),
      );
    }

    return Result.ok(new ServiceVersion(value));
  }
}
