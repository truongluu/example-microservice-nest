import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import * as slug from 'slug';
import { BaseStatus } from '../../shared/consts/base-status';
import { UserActive } from '../../shared/consts/user-active';
import { genUserCode } from '../../shared/utils';
import { IUser } from '../interfaces/user.interface';

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String },
    userCode: { type: String },
    slugName: { type: String },
    password: { type: String, required: true },
    email: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    address: String,
    phone: { type: String, required: true, unique: true },
    avatar: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: Number,
      enum: [BaseStatus.Active, BaseStatus.InActive],
      default: BaseStatus.Active,
    },
    startWorkingDate: { type: Date },
    userActive: {
      type: Number,
      enum: [UserActive.Online, UserActive.Offline],
      default: UserActive.Offline,
    },
    loginToken: { type: String },
    deleted: { type: Boolean, default: false },
    accountType: { type: String, default: 'user' },
    deletedAt: Date,
    secret: { type: Schema.Types.Mixed, default: {} },
    wallet: { type: Number, default: 0 },
    escrowWallet: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
const SALT_ROUNDS = 10;
UserSchema.pre<IUser>('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
    if (this.isNew) {
      this.userCode = genUserCode();
    }
    this.slugName = slug(this.fullName, { lower: true });
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (pw) {
  return await bcrypt.compare(pw, this.password);
};

['update', 'updateMany', 'updateOne'].forEach((method) => {
  UserSchema.pre<any>(method, async function (next) {
    try {
      let updateData;
      const updated = this.getUpdate() as any;
      if (updated.fullName) {
        updateData = { slugName: slug(updated.fullName, { lower: true }) };
      }
      if (updated.deleted) {
        updateData = { ...updateData, deletedAt: Date.now() };
      }
      if (updated.password) {
        updateData = {
          ...updateData,
          password: await bcrypt.hash(updated.password, SALT_ROUNDS),
        };
      }
      if (updateData) {
        this.update(updateData);
      }
      next();
    } catch (err) {
      next(err);
    }
  });
});

UserSchema.pre('find', function () {
  const queries = this.getQuery();
  if (queries.deleted) {
    this.where('deleted', +queries.deleted);
  } else {
    this.where('deleted', false);
  }
});

UserSchema.pre<any>('countDocuments', function () {
  const queries = this.getQuery();
  if (queries.deleted) {
    this.where('deleted', +queries.deleted);
  } else {
    this.where('deleted', false);
  }
});

UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    delete ret['secret'];
    delete ret['loginToken'];
    ret['wallet'] = Math.round(Number(ret['wallet'] ?? 0));
    ret['escrowWallet'] = Math.round(Number(ret['escrowWallet'] ?? 0));
    return ret;
  },
});

UserSchema.index({ slugName: 1 });
export { UserSchema };
