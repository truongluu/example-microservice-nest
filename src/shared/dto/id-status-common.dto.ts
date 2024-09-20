import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class IdStatusCommonDto {
  @ApiProperty({ type: Array })
  @IsNotEmpty()
  @IsArray()
  readonly ids: string[];

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  readonly status: number;
}
