import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '@nestjsmcs/core';
import { IdStatusCommonDto } from '../shared/dto/id-status-common.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('permission')
@Controller('permission')
export class PermissionController extends BaseController {
  constructor(
    configService: ConfigService,
    private readonly permissionService: PermissionService,
  ) {
    super(configService);
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Get()
  async getPermissions(@Query() queries: any) {
    const params = this.getParamsForList(queries);
    return await this.permissionService.getAll(null, params);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create permission success',
    type: CreatePermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @ApiOperation({ summary: 'Update permisson' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update permisson successfully',
    type: CreatePermissionDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async updatePermisson(
    @Param('id') permissonId,
    @Body() updatePermissonDto: CreatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(
      permissonId,
      updatePermissonDto,
    );
  }

  @ApiOperation({ summary: 'Delete permisson' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete permisson successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async deletePermisson(@Param('id') permissonId) {
    return await this.permissionService.deletePermission(permissonId);
  }

  @ApiOperation({ summary: 'Update many status permission' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Update many status permission success',
    type: IdStatusCommonDto,
  })
  @Post('updateStatus')
  async updatePermissionStatus(@Body() IdStatusCommonDto: IdStatusCommonDto) {
    return await this.permissionService.updateStatus(IdStatusCommonDto);
  }
}
