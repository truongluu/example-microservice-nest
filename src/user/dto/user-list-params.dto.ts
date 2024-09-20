import { BaseListParamsDto } from '@nestjsmcs/core';

export class UserListParamsDto extends BaseListParamsDto {
  userActive: number;
  ids: string;
}
