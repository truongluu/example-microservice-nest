import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly provinceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly districtId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly wardId: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  readonly phone: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  readonly startWorkingDate: Date;

  @ApiProperty()
  readonly token: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
