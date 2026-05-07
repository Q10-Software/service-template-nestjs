import { Result } from '@shared/domain/result/result'
import { Aggregate } from '@shared/domain/aggregates/aggregate'
import {
  CreateServiceInfoProps,
  IServiceInfo
} from '../entities/serviceInfo.entity'
import {
  ServiceStatus,
  ServiceStatusValue
} from '../valueObjects/serviceStatus.vo'
import { ServiceName } from '../valueObjects/serviceName.vo'
import { ServiceVersion } from '../valueObjects/serviceVersion.vo'
import { ServiceStartedAt } from '../valueObjects/serviceStartedAt.vo'

const ORIGIN = 'ServiceInfoAggregate.create'

export class ServiceInfoAggregate extends Aggregate<IServiceInfo> {
  get status(): ServiceStatusValue {
    return this._entity.status.value
  }

  get name(): string {
    return this._entity.name.value
  }

  get version(): string {
    return this._entity.version.value
  }

  get startedAt(): Date {
    return this._entity.startedAt.value
  }

  static create(props: CreateServiceInfoProps): Result<ServiceInfoAggregate> {
    const statusResult = ServiceStatus.create(props.status, ORIGIN)
    if (statusResult.isFail) return Result.fail(statusResult.error)

    const nameResult = ServiceName.create(props.name, ORIGIN)
    if (nameResult.isFail) return Result.fail(nameResult.error)

    const versionResult = ServiceVersion.create(props.version, ORIGIN)
    if (versionResult.isFail) return Result.fail(versionResult.error)

    const startedAtResult = ServiceStartedAt.create(props.startedAt, ORIGIN)
    if (startedAtResult.isFail) return Result.fail(startedAtResult.error)

    return Result.ok(
      new ServiceInfoAggregate({
        status: statusResult.value,
        name: nameResult.value,
        version: versionResult.value,
        startedAt: startedAtResult.value
      })
    )
  }
}
