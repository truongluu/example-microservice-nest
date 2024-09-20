import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IdCommonDto {
  @ApiProperty({ type: Array })
  @IsNotEmpty()
  readonly ids: [];
}
