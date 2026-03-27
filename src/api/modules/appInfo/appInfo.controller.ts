import { Controller, Get } from '@nestjs/common';
import { GetAppInfoUseCase } from '@context/appInfo/application/useCases/getAppInfo.useCase';
import { GetAppInfoMapper } from './appInfo.mapper';
import { GetAppInfoDto } from './appInfo.dto';

@Controller()
export class AppInfoController {
  constructor(
    private readonly getAppInfoUseCase: GetAppInfoUseCase,
    private readonly mapper: GetAppInfoMapper,
  ) {}

  @Get('info')
  execute(): GetAppInfoDto {
    const appInfo = this.getAppInfoUseCase.execute();
    return this.mapper.toResponse(appInfo);
  }
}
