import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetAppInfoDto {
  @IsNotEmpty()
  @IsIn(['ok'])
  status!: 'ok';

  @IsString()
  serviceName!: string;

  @IsString()
  version!: string;

  @IsDate()
  startedAt!: Date;
}
