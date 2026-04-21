import { Controller, Get } from '@nestjs/common';
import { GetServiceInfoUseCase } from '@context/serviceInfo/application/useCases/getServiceInfo.useCase';
import { GetServiceInfoMapper } from './serviceInfo.mapper';
import { GetServiceInfoDto } from './serviceInfo.dto';
import { LoggerService } from '../logging/logger.service';
// import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
// @UseInterceptors(CacheInterceptor)
export class ServiceInfoController {
  constructor(
    private readonly getServiceInfoUseCase: GetServiceInfoUseCase,
    private readonly mapper: GetServiceInfoMapper,
    private readonly logger: LoggerService,
  ) {
    this.logger = this.logger.setContext(this.constructor.name);
  }

  // @CacheKey('SERVICE_INFO')
  // @CacheTTL(60 * 60 * 24)
  @Get('info')
  execute(): GetServiceInfoDto {
    const serviceInfo = this.getServiceInfoUseCase.execute();
    this.logger.info('Service info retrieved');
    return this.mapper.toResponse(serviceInfo);
  }
}
