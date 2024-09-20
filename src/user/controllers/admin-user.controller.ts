import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiImplicitParamsQueryDecorator,
  BaseController,
} from '@nestjsmcs/core';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UserListParamsDto } from '../dto/user-list-params.dto';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

import { ConfigService } from '@nestjs/config';
import { UserActive } from '../../shared/consts/user-active';
import { IdStatusCommonDto } from '../../shared/dto/id-status-common.dto';
import { AdminUserService } from '../services/admin-user.service';

@ApiTags('admin/user')
@Controller('admin/user')
@ApiBearerAuth('adminAuth')
export class AdminUserController extends BaseController {
  constructor(
    configService: ConfigService,
    private readonly userService: AdminUserService,
  ) {
    super(configService);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiImplicitParamsQueryDecorator([
    {
      name: 'ids',
      description: 'user id, seperate by comma',
      type: String,
      required: false,
    },
    {
      name: 'userActive',
      description: 'User active',
      type: Number,
      enum: [UserActive.Online, UserActive.Offline],
      required: false,
    },
  ])
  @Get()
  async getUsers(@Query() queries: UserListParamsDto, @Request() req) {
    const params = this.getParamsForList<UserListParamsDto>(queries);

    return await this.userService.getAllExtend(params);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Change success successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Change password error',
  })
  @Post('change-password')
  async changePassword(@Body() data: ChangePasswordUserDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    if (user.token !== data.token) {
      throw new BadRequestException('Token incorrect');
    }

    return await this.userService.changePassword(data);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update password success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update password error',
  })
  @Post(':id/update-password')
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: String,
    required: true,
  })
  @ApiBearerAuth('adminAuth')
  async updatePassword(
    @Param('id') userId,
    @Body() data: UpdatePasswordUserDto,
  ) {
    return await this.userService.updatePassword(userId, data);
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create user success',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update user successfully',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async updateUser(@Param('id') userId, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete user successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async deleteUser(@Param('id') userId) {
    return await this.userService.softRemoveSingle(userId);
  }

  @ApiOperation({ summary: 'Detail user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Get detail user successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async partnerDetail(@Param('id') userId) {
    return await this.userService.detail(userId);
  }

  @ApiOperation({ summary: 'Update many status user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update many status user success',
    type: IdStatusCommonDto,
  })
  @Post('updateStatus')
  async updateStatusChannel(@Body() IdStatusCommonDto: IdStatusCommonDto) {
    return await this.userService.updateStatus(IdStatusCommonDto);
  }
}
