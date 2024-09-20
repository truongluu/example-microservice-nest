import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @ApiProperty({ type: String })
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
