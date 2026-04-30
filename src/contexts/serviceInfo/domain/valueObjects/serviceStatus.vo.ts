import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { serviceInfoErrors } from '../errors/serviceInfo.errors';

const VALID_STATUSES = ['ok'] as const;
export type ServiceStatusValue = typeof VALID_STATUSES[number];

export class ServiceStatus extends ValueObject<ServiceStatusValue> {
  private constructor(value: ServiceStatusValue) {
    super(value);
  }

  static create(value: string, origin: string): Result<ServiceStatus> {
    if (!VALID_STATUSES.includes(value as ServiceStatusValue)) {
      return Result.fail(
        serviceInfoErrors.invalidStatus(origin, { value }),
      );
    }

    return Result.ok(new ServiceStatus(value as ServiceStatusValue));
  }
}
