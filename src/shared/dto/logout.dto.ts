import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty()
  readonly deviceToken: string;
}
