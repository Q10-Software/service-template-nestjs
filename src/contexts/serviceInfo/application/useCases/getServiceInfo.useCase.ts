import { ServiceInfoAggregate } from '../../domain/aggregates/serviceInfo.aggregate';
import { IGetNpmPackagePort } from '../ports/getNpmPackage.port';
import { GetServiceInfoOutput } from './getServiceInfo.output';

export class GetServiceInfoUseCase {
  private readonly startedAt: Date;

  constructor(private readonly getNpmPackagePort: IGetNpmPackagePort) {
    this.startedAt = new Date();
  }

  execute(): GetServiceInfoOutput {
    const npmPackage = this.getNpmPackagePort.execute();

    const serviceInfo = ServiceInfoAggregate.create({
      status: 'ok',
      name: npmPackage.name,
      version: npmPackage.version,
      startedAt: this.startedAt,
    });

    return {
      status: serviceInfo.status,
      name: serviceInfo.name,
      version: serviceInfo.version,
      startedAt: serviceInfo.startedAt,
    };
  }
}
