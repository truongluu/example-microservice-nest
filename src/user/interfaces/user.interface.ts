import { IBaseSchema } from '@nestjsmcs/core';

export interface IUser extends IBaseSchema {
  fullName: string;
  userCode: string;
  slugName: string;
  password: string;
  email: string;
  phone: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  address: string;
  avatar: any;
  token: string;
  userActive: number;
  deleted: boolean;
  startWorkingDate: Date;
  loginToken: string;
  accountType: string;
  status: number;
  secret: object & { base32?: string };
  wallet: number;
  escrowWallet: number;
  comparePassword(pw: String): Promise<boolean>;
}
