import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateUserProfileDto {
  @ApiPropertyOptional({ type: String })
  readonly fullName: string;

  @ApiPropertyOptional({ type: String })
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional()
  readonly provinceId: String;

  @ApiPropertyOptional()
  readonly districtId: String;

  @ApiPropertyOptional()
  readonly wardId: String;

  @ApiPropertyOptional()
  readonly address: String;

  @ApiPropertyOptional({ type: Object, default: {} })
  readonly avatar: object;
}

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
