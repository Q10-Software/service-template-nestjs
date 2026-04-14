import { Module } from '@nestjs/common';
import { GetServiceInfoUseCase } from '@context/serviceInfo/application/useCases/getServiceInfo.useCase';
import {
  GET_NPM_PACKAGE_PORT,
  IGetNpmPackagePort,
} from '@context/serviceInfo/application/ports/getNpmPackage.port';
import { ServiceInfoController } from './serviceInfo.controller';
import { GetServiceInfoMapper } from './serviceInfo.mapper';
import { GetNpmPackageAdapter } from '../../../infrastructure/adapters/getNpmPackage.adapter';

@Module({
  controllers: [ServiceInfoController],
  providers: [
    GetServiceInfoMapper,
    GetNpmPackageAdapter,
    {
      provide: GET_NPM_PACKAGE_PORT,
      useExisting: GetNpmPackageAdapter,
    },
    {
      provide: GetServiceInfoUseCase,
      useFactory: (getNpmPackagePort: IGetNpmPackagePort) =>
        new GetServiceInfoUseCase(getNpmPackagePort),
      inject: [GET_NPM_PACKAGE_PORT],
    },
  ],
})
export class ServiceInfoModule {}
