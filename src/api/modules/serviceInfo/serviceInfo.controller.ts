import { Controller, Get } from '@nestjs/common';
import { GetServiceInfoUseCase } from '@context/serviceInfo/application/useCases/getServiceInfo.useCase';
import { GetServiceInfoMapper, MapperResponse } from './serviceInfo.mapper';
import { LoggerService } from '../logging/logger.service';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';

abstract class RootController {
  protected readonly logger: LoggerService;

  constructor(_logger: LoggerService) {
    this.logger = _logger.setContext(this.constructor.name);
  }

  abstract _execute(): Promise<MapperResponse>;

  @Get('info')
  async execute(): Promise<Result<unknown, DomainError>> {
    this.logger.info('Executing controller');
    const result = await this._execute();
    this.logger.info('Controller executed');
    return result;
  }
}

@Controller()
export class ServiceInfoController extends RootController {
  constructor(
    private readonly getServiceInfoUseCase: GetServiceInfoUseCase,
    private readonly mapper: GetServiceInfoMapper,
    private readonly _logger: LoggerService,
  ) {
    super(_logger);
  }

  async _execute(): Promise<MapperResponse> {
    const result = this.getServiceInfoUseCase.execute();
    this.logger.info('Service info retrieved at ' + new Date().toISOString());
    return this.mapper.toResponse(result);
  }
}
