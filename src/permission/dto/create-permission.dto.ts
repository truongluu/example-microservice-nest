import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly module: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly permission: string;
}
