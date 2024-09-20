import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdStatusCommonDto } from '../../shared/dto/id-status-common.dto';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UserListParamsDto } from '../dto/user-list-params.dto';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { IUser } from '../interfaces/user.interface';
import { BaseUserService } from './base-user.service';

@Injectable()
export class AdminUserService extends BaseUserService {
  constructor(@InjectModel('User') public readonly userModel: Model<IUser>) {
    super();
    this.baseModel = userModel;
  }

  async getAllExtend(queries: UserListParamsDto) {
    let { total, query } = await this.getAll(null, queries, true, [
      'slugName',
      'userCode',
      'phone',
    ]);
    if (queries.ids) {
      const ids = queries.ids.split(',').map((v) => v.replace(/\s+/g, ''));
      query = query.where('_id', ids);
      total = total.where('_id', ids);
    }

    if (queries.userActive !== undefined) {
      query = query.where('userActive', +queries.userActive);
      total = total.where('userActive', +queries.userActive);
    }

    return {
      list: await query.exec(),
      pagination: {
        total: await total.exec(),
        pageSize: +queries.pageSize,
        current: +queries.currentPage || 1,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = new this.baseModel(createUserDto);
    return await createdUser.save();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    await this.baseModel.updateOne({ _id: userId }, updateUserDto).exec();
    return await this.baseModel.findOne({ _id: userId }).exec();
  }

  async updateUserWith(where: object, data: object) {
    return await this.baseModel.updateOne(where, data).exec();
  }

  async changePassword(data: ChangePasswordUserDto) {
    return await this.baseModel
      .updateOne(
        { email: data.email, token: data.token },
        { password: data.password, token: null },
      )
      .exec();
  }

  async updatePassword(user: string, data: UpdatePasswordUserDto) {
    return await this.baseModel
      .updateOne({ _id: user }, { password: data.password })
      .exec();
  }

  async deleteUser(userId: string) {
    return await this.baseModel
      .updateOne({ _id: userId }, { deleted: true })
      .exec();
  }

  async updateStatus(IdStatusCommonDto: IdStatusCommonDto) {
    return await this.baseModel
      .updateMany(
        { _id: IdStatusCommonDto.ids },
        { status: IdStatusCommonDto.status },
      )
      .exec();
  }
}
