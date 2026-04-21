import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { GetServiceInfoOutput } from '@context/serviceInfo/application/useCases/getServiceInfo.output';
import { GetServiceInfoDto } from './serviceInfo.dto';
import { ValidationOutputException } from './validation-output.exception';

@Injectable()
export class GetServiceInfoMapper {
  toResponse(serviceInfo: GetServiceInfoOutput): GetServiceInfoDto {
    const data: GetServiceInfoDto = {
      status: serviceInfo.status,
      name: serviceInfo.name,
      version: serviceInfo.version,
      startedAt: serviceInfo.startedAt,
    };

    const dto = plainToInstance(GetServiceInfoDto, data);

    const errors: ValidationError[] = validateSync(dto, {
      forbidUnknownValues: true,
    });

    if (errors.length) {
      throw new ValidationOutputException(errors);
    }

    return dto;
  }
}
