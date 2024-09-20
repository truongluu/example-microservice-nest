import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { BaseStatus } from '@nestjsmcs/core';
import { Model, UpdateQuery } from 'mongoose';
import * as slug from 'slug';
import * as speakeasy from 'speakeasy';
import { UserActive } from '../../shared/consts/user-active';
import { LoginOtpDto } from '../../shared/dto/login-otp.dto';
import { LogoutDto } from '../../shared/dto/logout.dto';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { IUser } from '../interfaces/user.interface';
import { BaseUserService } from './base-user.service';

@Injectable()
export class UserService extends BaseUserService {
  constructor(
    @InjectModel('User') public readonly userModel: Model<IUser>,
    public readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.baseModel = userModel;
  }
  async changePassword(data: ChangePasswordUserDto) {
    return await this.userModel
      .updateOne(
        { email: data.email, token: data.token },
        { password: data.password, token: null },
      )
      .exec();
  }

  async updatePassword(user: string, data: UpdatePasswordUserDto) {
    return await this.userModel
      .updateOne({ _id: user }, { password: data.password })
      .exec();
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    let updateUserData = { ...updateUserProfileDto, slugName: '' };

    if (updateUserProfileDto.fullName) {
      updateUserData.slugName = slug(updateUserProfileDto.fullName, {
        lower: true,
      });
    }
    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        updateUserData as unknown as UpdateQuery<IUser>,
        { new: true },
      )
      .exec();
  }

  async deactiveUser(userId: string) {
    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { status: BaseStatus.InActive },
        { new: true },
      )
      .exec();
  }

  async getOtp(phone: string) {
    if (!/^0\d{9}$/.test(phone)) {
      throw new BadRequestException('Phone number is invalid');
    }
    let validUser = null;
    try {
      validUser = await this.getValidUserByKey('phone', phone);
    } catch (error) {
      validUser = await this.createNewUserWithPhone(phone);
    }

    if (!validUser?.secret?.base32) {
      // Generate otp data
      validUser.secret = speakeasy.generateSecret({
        name: `MyAppUser:${validUser.phone}`,
      });
      await validUser.save();
    }

    const otpCode = speakeasy.totp({
      secret: validUser.secret.base32,
      encoding: 'base32',
      digits: 6,
      window: 10,
    });

    const otpData = {
      phone: validUser.phone,
    };
    let otpResponse = { otpCode: '', token: '' };

    const otpToken = this.jwtService.sign(otpData, {
      secret: this.configService.get('jwt.user_otp_secret'),
      expiresIn: this.configService.get('jwt.user_otp_secret_expires'),
    });
    return { ...otpResponse, token: otpToken };
  }

  async createNewUserWithPhone(phone: string) {
    const createdUserModel = new this.baseModel({
      phone,
      fullName: phone,
      password: '123321345@@',
    });
    const createdUser = await createdUserModel.save();
    if (!createdUser) {
      throw new BadRequestException();
    }
    return createdUser;
  }

  async verifyOtp(otpData: LoginOtpDto) {
    const { otp, token } = otpData;

    let tokenData;
    try {
      tokenData = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.user_otp_secret'),
      });
    } catch (e) {
      throw new BadRequestException();
    }

    if (!tokenData || !tokenData.phone) {
      throw new BadRequestException();
    }
    const validUser = await this.getValidUserByKey('phone', tokenData?.phone);
    if (!validUser) {
      throw new BadRequestException();
    }

    const verified = speakeasy.totp.verify({
      secret: validUser.secret.base32,
      encoding: 'base32',
      window: 10,
      digits: 6,
      token: otp,
    });

    if (!verified) {
      throw new BadRequestException();
    }
    return { userId: validUser?._id };
  }

  async loginOtp(otpData: LoginOtpDto) {
    const validUser = await this.verifyOtp(otpData);
    const payload = { act: 'token', sub: validUser.userId };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.user_secret'),
      expiresIn: this.configService.get('jwt.user_secret_expires'),
    });
    return {
      currentAuthority: 'user',
      access_token,
    };
  }

  async verify(userId: string, populates: string) {
    const foundUser = await this.findUserById(userId, populates);
    if (!foundUser || !foundUser.status || foundUser.deleted) {
      throw new UnauthorizedException();
    }
    return foundUser;
  }

  async validate(loginUserDto: LoginUserDto) {
    const user = await this.findUserByPhone(loginUserDto.phone);
    if (!user || !user.status || user.deleted) {
      throw new BadRequestException('Phone or password is incorrect');
    }
    const match = await user.comparePassword(loginUserDto.password);
    if (!match) {
      throw new BadRequestException('Phone or password is incorrect');
    }
    const payload = { sub: user._id };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.user_secret'),
      expiresIn: this.configService.get('jwt.user_secret_expires'),
    });
    await this.userModel
      .updateOne(
        { _id: user._id },
        { loginToken: access_token, userActive: UserActive.Online },
      )
      .exec();
    return {
      currentAuthority: 'user',
      access_token,
    };
  }

  async logout(req, logoutDto: LogoutDto) {
    const authorizationHeader = req.headers['authorization'];
    const userId = req.user?._id;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1] || '';
      if (token) {
        await this.userModel
          .updateOne(
            { loginToken: token },
            { userActive: UserActive.Offline, loginToken: '' },
          )
          .exec();
      }
    }
    return true;
  }
}
