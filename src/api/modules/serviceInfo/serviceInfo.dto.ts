import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetServiceInfoDto {
  @IsNotEmpty()
  @IsIn(['ok'])
  status!: 'ok';

  @IsString()
  name!: string;

  @IsString()
  version!: string;

  @IsDate()
  startedAt!: Date;
}
