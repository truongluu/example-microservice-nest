import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { BaseController } from '@nestjsmcs/core';

import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { internalUserMapper } from '../mappers/internal';
import { UserService } from '../services/user.service';

@ApiTags('internal/user')
@Controller('internal/user')
@ApiBearerAuth('internalAuth')
export class InternalController extends BaseController {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super(configService);
  }

  @ApiOperation({ summary: 'Get user detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @Get(':id')
  async getUserDetail(@Param('id') userId: string) {
    const userData = await this.userService.detail(userId);
    if (userData) {
      return internalUserMapper(userData as any);
    }
    return {};
  }
}
