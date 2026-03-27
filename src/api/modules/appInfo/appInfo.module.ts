import { Module } from '@nestjs/common';
import { GetAppInfoUseCase } from '@context/appInfo/application/useCases/getAppInfo.useCase';
import {
  GET_NPM_PACKAGE_PORT,
  IGetNpmPackagePort,
} from '@context/appInfo/application/ports/getNpmPackage.port';
import { AppInfoController } from './appInfo.controller';
import { GetAppInfoMapper } from './appInfo.mapper';
import { GetNpmPackageAdapter } from '../../../infrastructure/adapters/getNpmPackage.adapter';

@Module({
  controllers: [AppInfoController],
  providers: [
    GetAppInfoMapper,
    GetNpmPackageAdapter,
    {
      provide: GET_NPM_PACKAGE_PORT,
      useExisting: GetNpmPackageAdapter,
    },
    {
      provide: GetAppInfoUseCase,
      useFactory: (getNpmPackagePort: IGetNpmPackagePort) =>
        new GetAppInfoUseCase(getNpmPackagePort),
      inject: [GET_NPM_PACKAGE_PORT],
    },
  ],
})
export class AppInfoModule {}
