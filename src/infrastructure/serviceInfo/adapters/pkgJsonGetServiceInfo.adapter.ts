import { Injectable } from '@nestjs/common';
import { GetServiceInfoPortOutput } from '@context/serviceInfo/application/interfaces/getServiceInfoPortOutput.interface';
import { GetServiceInfoPort } from '@context/serviceInfo/application/ports/getServiceInfo.port';
import { GetPackageJsonDataService } from '../services/getPackageJsonData.service';

@Injectable()
export class PkgJsonGetServiceInfoAdapter implements GetServiceInfoPort {
  private readonly servideInfoData: GetServiceInfoPortOutput;

  constructor(private readonly getPackageJsonDataService: GetPackageJsonDataService) {
    this.servideInfoData = this.getPackageJsonDataService.execute();
  }

  execute(): GetServiceInfoPortOutput {
    return this.servideInfoData;
  }
}
