import { Schema } from 'mongoose';
import { BaseStatus } from '../../shared/consts/base-status';

const PermissionSchema = new Schema({
  module: { type: String, required: true },
  action: { type: String, required: true },
  permission: { type: String, required: true, unique: true },
  status: { type: Number, enum: [BaseStatus.Active, BaseStatus.InActive], default: BaseStatus.Active },
}, {
  timestamps: true
});


export {
  PermissionSchema
};