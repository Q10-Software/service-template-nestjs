import { Result } from '@shared/domain/result/result'
import { ValueObject } from '@shared/domain/valueObjects/valueObject'
import { serviceInfoErrors } from '../errors/serviceInfo.errors'

export class ServiceStartedAt extends ValueObject<Date> {
  private constructor(value: Date) {
    super(value)
  }

  static create(value: Date, origin: string): Result<ServiceStartedAt> {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return Result.fail(
        serviceInfoErrors.invalidStartedAt(origin, {
          value,
          reason: 'startedAt must be a valid date'
        })
      )
    }

    if (value > new Date()) {
      return Result.fail(
        serviceInfoErrors.invalidStartedAt(origin, {
          reason: 'startedAt cannot be in the future'
        })
      )
    }

    return Result.ok(new ServiceStartedAt(value))
  }
}
