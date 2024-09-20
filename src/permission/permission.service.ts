import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@nestjsmcs/core';
import { Model } from 'mongoose';
import { IdStatusCommonDto } from '../shared/dto/id-status-common.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService extends BaseService {
  constructor(
    @InjectModel('Permission') private readonly permissionModel: Model<any>,
  ) {
    super();
    this.baseModel = permissionModel;
  }

  async getAllExtend(queries: any) {
    let { query, total } = await this.getAll(null, queries, true);
    return {
      list: await query.lean().exec(),
      pagination: {
        total: await total.exec(),
        pageSize: +queries.pageSize,
        current: +queries.currentPage || 1,
      },
    };
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<any> {
    const createdPermission = new this.permissionModel(createPermissionDto);
    return await createdPermission.save();
  }

  async updatePermission(
    permissionId: String,
    updatePermissionDto: CreatePermissionDto,
  ) {
    await this.permissionModel
      .updateOne({ _id: permissionId }, updatePermissionDto)
      .exec();
    return await this.permissionModel.findOne({ _id: permissionId }).exec();
  }

  async deletePermission(permissionId: String) {
    return await this.permissionModel.deleteOne({ _id: permissionId }).exec();
  }

  async updateStatus(IdStatusCommonDto: IdStatusCommonDto) {
    return await this.permissionModel
      .updateMany(
        { _id: IdStatusCommonDto.ids },
        { status: IdStatusCommonDto.status },
      )
      .exec();
  }
}
