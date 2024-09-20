import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginOtpDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly otp: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly token: string;
}
