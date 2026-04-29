import { Injectable } from '@nestjs/common';
import { GetServiceInfoPortOutput } from '@context/serviceInfo/application/interfaces/getServiceInfoPortOutput.interface';
import { GetServiceInfoPort } from '@context/serviceInfo/application/ports/getServiceInfo.port';
import { GetPackageJsonDataService } from '../services/getPackageJsonData.service';

@Injectable()
export class PkgJsonGetServiceInfoAdapter implements GetServiceInfoPort {
  constructor(private readonly getPackageJsonDataService: GetPackageJsonDataService) {}

  execute(): GetServiceInfoPortOutput {
    return this.getPackageJsonDataService.execute();
  }
}
