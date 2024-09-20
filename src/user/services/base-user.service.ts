import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@nestjsmcs/core';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';

import { IdStatusCommonDto } from '../../shared/dto/id-status-common.dto';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UserListParamsDto } from '../dto/user-list-params.dto';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class BaseUserService extends BaseService<IUser> {
  constructor() {
    super();
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

  async updateUserWith(where: Object, data: Object) {
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

  async updateStatus(IdStatusCommonDto: IdStatusCommonDto) {
    return await this.baseModel
      .updateMany(
        { _id: IdStatusCommonDto.ids },
        { status: IdStatusCommonDto.status },
      )
      .exec();
  }

  async findUserById(userId: string, populates: string) {
    let foundUserQuery = this.baseModel.findById(userId);
    if (populates) {
      populates
        .split(',')
        .map((v) => v.replace(/\s+/g, ''))
        .forEach((populate) => {
          if (populate) {
            foundUserQuery = foundUserQuery.populate(populate);
          }
        });
    }
    return await foundUserQuery.exec();
  }

  async getValidUserByKey(key: string, value: string | number | boolean) {
    const foundUser = await this.findUserByKey(key, value);
    if (!foundUser || !foundUser.status || foundUser.deleted) {
      throw new NotFoundException();
    }
    return foundUser;
  }

  async findUserByKey(key: string, value: string | number | boolean) {
    return await this.baseModel.findOne({ [key]: value }).exec();
  }

  async findUserByUserName(userName: string) {
    return await this.findUserByKey('userName', userName);
  }

  async findUserByPhone(phone: string) {
    return await this.findUserByKey('phone', phone);
  }

  async findUserByEmail(email: string) {
    return await this.findUserByKey('email', email);
  }

  async updateWallet(userId: string, amount: number, operator: string = '+') {
    await this.baseModel
      .updateOne(
        { _id: userId },
        { $inc: { wallet: operator === '+' ? amount : -amount } },
      )
      .orFail();
  }

  async updateEscrowWallet(
    userId: string,
    amount: number,
    operator: string = '+',
  ) {
    await this.baseModel
      .updateOne(
        { _id: userId },
        { $inc: { escrowWallet: operator === '+' ? amount : -amount } },
      )
      .orFail();
  }
}
