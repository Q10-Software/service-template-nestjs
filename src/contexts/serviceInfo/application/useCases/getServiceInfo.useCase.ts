import { ServiceInfoAggregate } from '../../domain/aggregates/serviceInfo.aggregate';
import { GetServiceInfoPort } from '../ports/getServiceInfo.port';
import { GetServiceInfoOutput } from './getServiceInfo.output';

export class GetServiceInfoUseCase {
  private readonly startedAt: Date;

  constructor(private readonly getServiceInfoPort: GetServiceInfoPort) {
    this.startedAt = new Date();
  }

  execute(): GetServiceInfoOutput {
    const serviceInfo = this.getServiceInfoPort.execute();

    const aServiceInfo = ServiceInfoAggregate.create({
      status: 'ok',
      name: serviceInfo.name,
      version: serviceInfo.version,
      startedAt: this.startedAt,
    });

    return {
      status: aServiceInfo.status,
      name: aServiceInfo.name,
      version: aServiceInfo.version,
      startedAt: aServiceInfo.startedAt,
    };
  }
}
