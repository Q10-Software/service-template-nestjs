import {
  CreateServiceInfoProps,
  IServiceInfo,
} from '../entities/serviceInfo.entity';

export class ServiceInfoAggregate {
  private readonly _entity: IServiceInfo;

  constructor(entity: IServiceInfo) {
    this._entity = entity;
  }

  get status(): IServiceInfo['status'] {
    return this._entity.status;
  }

  get name(): IServiceInfo['name'] {
    return this._entity.name;
  }

  get version(): IServiceInfo['version'] {
    return this._entity.version;
  }

  get startedAt(): IServiceInfo['startedAt'] {
    return this._entity.startedAt;
  }

  static create(props: CreateServiceInfoProps): ServiceInfoAggregate {
    const entity: IServiceInfo = {
      status: props.status,
      name: props.name,
      version: props.version,
      startedAt: props.startedAt,
    };

    return new ServiceInfoAggregate(entity);
  }
}
