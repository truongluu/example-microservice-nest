import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { BaseController } from '@nestjsmcs/core';
import { LoginOtpDto } from '../../shared/dto/login-otp.dto';
import { LogoutDto } from '../../shared/dto/logout.dto';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';
import { ForgotUserDto } from '../dto/forgot-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController extends BaseController {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super(configService);
  }

  @ApiOperation({ summary: 'Get Otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Otp successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get Otp error',
  })
  @ApiQuery({
    name: 'phone',
    description: 'Phone',
    required: true,
    type: String,
  })
  @Get('get-otp')
  async getOtp(@Query('phone') phone: string) {
    return await this.userService.getOtp(phone);
  }

  @ApiOperation({ summary: 'Verify Otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify Otp successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Verify Otp error',
  })
  @Post('verify-otp')
  async verifyOtp(@Body() loginOtpDto: LoginOtpDto) {
    return await this.userService.verifyOtp(loginOtpDto);
  }

  @ApiOperation({ summary: 'Login Otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login Otp successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Login Otp error',
  })
  @Post('login-otp')
  async loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    return await this.userService.loginOtp(loginOtpDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email or password is incorrect',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.validate(loginUserDto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Request success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Forgot error',
  })
  @Post('forgot')
  async forgot(@Body() data: ForgotUserDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const TokenGenerator = require('uuid-token-generator');

    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
    const token = tokgen.generate();

    await this.userService.updateUserWith(
      {
        _id: user._id,
      },
      {
        token: token,
      },
    );
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Change success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Change password error',
  })
  @Post('change-password')
  async changePassword(@Body() data: ChangePasswordUserDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    if (user.token !== data.token) {
      throw new BadRequestException('Token incorrect');
    }

    return await this.userService.changePassword(data);
  }

  @ApiOperation({ summary: 'Token password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token error',
  })
  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify user successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authorized',
  })
  @ApiBearerAuth('userAuth')
  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  @ApiQuery({
    name: 'populates',
    description: 'Populates field',
    required: false,
  })
  async verifyUser(@Request() req, @Query() queries) {
    const user = req.user;

    return await this.userService.verify(user.userId, queries.populates);
  }

  @ApiOperation({ summary: 'Verify authenticated user' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiBearerAuth('userAuth')
  @UseGuards(AuthGuard('jwt'))
  @Get('verify-authenticated-user')
  authenticated() {
    return 'Ok';
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update password successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update password error',
  })
  @Post(':id/update-password')
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: String,
    required: true,
  })
  async updatePassword(
    @Param('id') userId,
    @Body() data: UpdatePasswordUserDto,
  ) {
    return await this.userService.updatePassword(userId, data);
  }

  @ApiBearerAuth('userAuth')
  @Post('logout')
  async logout(@Request() req, @Body() logoutDto: LogoutDto) {
    return await this.userService.logout(req, logoutDto);
  }

  @ApiBearerAuth('userAuth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update user profile successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update user profile error',
  })
  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: String,
    required: true,
  })
  async updateUserProfile(
    @Param('id') userId,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return await this.userService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
  }

  @ApiBearerAuth('userAuth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Deactive user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deactive user successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Deactive user error',
  })
  @Put('/status/deactive')
  async deactiveUser(@Request() req) {
    const userId = req.user.userId;
    return await this.userService.deactiveUser(userId);
  }
}
