export interface IInternalUser {
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
  avatar: string;
  token: string;
  userActive: number;
  deleted: boolean;
  status: number;
  secret: object;
}
