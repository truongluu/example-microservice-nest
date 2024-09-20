import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ImageCommonDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly path: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  readonly metadata: object;
}
