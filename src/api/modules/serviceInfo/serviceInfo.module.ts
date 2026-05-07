import { Module } from '@nestjs/common'
import { GetServiceInfoUseCase } from '@context/serviceInfo/application/useCases/getServiceInfo.useCase'
import {
  GET_SERVICE_INFO_PORT,
  GetServiceInfoPort
} from '@context/serviceInfo/application/ports/getServiceInfo.port'
import { ServiceInfoController } from './serviceInfo.controller'
import { GetServiceInfoMapper } from './serviceInfo.mapper'
import { PkgJsonGetServiceInfoAdapter } from '@infrastructure/serviceInfo/adapters/pkgJsonGetServiceInfo.adapter'
import { GetPackageJsonDataService } from '@infrastructure/serviceInfo/services/getPackageJsonData.service'

@Module({
  controllers: [ServiceInfoController],
  providers: [
    GetServiceInfoMapper,
    PkgJsonGetServiceInfoAdapter,
    {
      provide: GET_SERVICE_INFO_PORT,
      useExisting: PkgJsonGetServiceInfoAdapter
    },
    {
      provide: GetServiceInfoUseCase,
      useFactory: (getNpmPackagePort: GetServiceInfoPort) =>
        new GetServiceInfoUseCase(getNpmPackagePort),
      inject: [GET_SERVICE_INFO_PORT]
    },
    GetPackageJsonDataService
  ]
})
export class ServiceInfoModule {}
