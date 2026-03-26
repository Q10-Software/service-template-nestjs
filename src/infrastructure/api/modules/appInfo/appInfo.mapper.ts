import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { GetAppInfoOutput } from '@context/appInfo/application/useCases/getAppInfo.output';
import { GetAppInfoDto } from './appInfo.dto';
import { ValidationOutputException } from './validation-output.exception';

export class GetAppInfoMapper {
  toResponse(appInfo: GetAppInfoOutput): GetAppInfoDto {
    const data: GetAppInfoDto = {
      status: appInfo.status,
      name: appInfo.name,
      version: appInfo.version,
      startedAt: appInfo.startedAt,
    };

    const dto = plainToInstance(GetAppInfoDto, data);

    const errors: ValidationError[] = validateSync(dto, {
      forbidUnknownValues: true,
    });

    if (errors.length) {
      throw new ValidationOutputException(errors);
    }

    return dto;
  }
}
