import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { GetServiceInfoOutput } from '@context/serviceInfo/application/useCases/getServiceInfo.output';
import { GetServiceInfoDto } from './serviceInfo.dto';
import { Result } from '@shared/domain/result/result';
import { DomainError } from '@shared/domain/errors/domainError';
import { ValidationErrorDetail } from '@shared/domain/errors/baseErrors';
import { serviceInfoErrors } from '@context/serviceInfo/domain/errors/serviceInfo.errors';

export type MapperResponse = Result<GetServiceInfoDto, DomainError> | Result<unknown, DomainError>;

@Injectable()
export class GetServiceInfoMapper {
  toResponse(result: Result<GetServiceInfoOutput, DomainError>): MapperResponse {
    if (result.isFail) return result;

    const dto = plainToInstance(GetServiceInfoDto, {...result.value, status: 1});

    const errors: ValidationError[] = validateSync(dto, {
      forbidUnknownValues: true,
    });

    if (errors.length) {
      return Result.fail(serviceInfoErrors.mapperValidation({ origin: 'GetServiceInfoMapper.toResponse', details: this.toErrorDetails(errors) }));
    }

    return Result.ok(dto);
  }

  private toErrorDetails(errors: ValidationError[]): ValidationErrorDetail[] {
    return errors.map((error) => ({
      property: error.property,
      value: error.value,
      errors: Object.values(error.constraints || {}),
    }));
  }
}