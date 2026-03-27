import { AppInfoAggregate } from '../../domain/aggregates/appInfo.aggregate';
import { IGetNpmPackagePort } from '../ports/getNpmPackage.port';
import { GetAppInfoOutput } from './getAppInfo.output';

export class GetAppInfoUseCase {
  private readonly startedAt: Date;

  constructor(private readonly getNpmPackagePort: IGetNpmPackagePort) {
    this.startedAt = new Date();
  }

  execute(): GetAppInfoOutput {
    const npmPackage = this.getNpmPackagePort.execute();

    const appInfo = AppInfoAggregate.create({
      status: 'ok',
      name: npmPackage.name,
      version: npmPackage.version,
      startedAt: this.startedAt,
    });

    return {
      status: appInfo.status,
      serviceName: appInfo.name,
      version: appInfo.version,
      startedAt: appInfo.startedAt,
    };
  }
}
