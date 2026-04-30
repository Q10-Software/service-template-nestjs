import { UseCase } from '@shared/application/useCases/useCase.interface';
import { ServiceInfoAggregate } from '../../domain/aggregates/serviceInfo.aggregate';
import { GetServiceInfoPort } from '../ports/getServiceInfo.port';
import { GetServiceInfoOutput } from './getServiceInfo.output';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';

export class GetServiceInfoUseCase implements UseCase<void, GetServiceInfoOutput> {
  private readonly startedAt: Date;

  constructor(private readonly getServiceInfoPort: GetServiceInfoPort) {
    this.startedAt = new Date();
  }

  execute(): Result<GetServiceInfoOutput, DomainError> {
    const serviceInfo = this.getServiceInfoPort.execute();

    const aggregateResult = ServiceInfoAggregate.create({
      status: 'ok',
      name: serviceInfo.name,
      version: serviceInfo.version,
      startedAt: this.startedAt,
    });

    if (aggregateResult.isFail) return Result.fail(aggregateResult.error);

    const aggregate = aggregateResult.value;

    return Result.ok({
      status: aggregate.status,
      name: aggregate.name,
      version: aggregate.version,
      startedAt: aggregate.startedAt,
    });
  }
}
