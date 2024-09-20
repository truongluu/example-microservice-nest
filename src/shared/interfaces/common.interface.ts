import { Document } from 'mongoose';

export interface ICommon extends Document {
  readonly name: string;
  slugName: string;
  deleted: boolean;
}
