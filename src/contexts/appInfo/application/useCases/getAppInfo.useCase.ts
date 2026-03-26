import { AppInfoAggregate } from '../../domain/aggregates/appInfo.aggregate';
import { IGetNpmPackageService } from '../interfaces/getNpmPackage.service.interface';
import { GetAppInfoOutput } from './getAppInfo.output';

export class GetAppInfoUseCase {
  private readonly startedAt: Date;

  constructor(private readonly getNpmPackageService: IGetNpmPackageService) {
    this.startedAt = new Date();
  }

  execute(): GetAppInfoOutput {
    const npmPackage = this.getNpmPackageService.execute();

    const appInfo = AppInfoAggregate.create({
      status: 'ok',
      name: npmPackage.name,
      version: npmPackage.version,
      startedAt: this.startedAt,
    });

    return {
      status: appInfo.status,
      name: appInfo.name,
      version: appInfo.version,
      startedAt: appInfo.startedAt,
    };
  }
}
