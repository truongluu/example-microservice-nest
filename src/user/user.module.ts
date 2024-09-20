import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

// import { UserMiddleware } from 'libs/nest-lib/src';
import { ConfigService } from '@nestjs/config';
import { createUserMiddleware } from '@nestjsmcs/core';
import { AdminUserController } from './controllers/admin-user.controller';
import { UserController } from './controllers/user.controller';
import { UserJwtStrategy } from './jwt.strategy';
import { UserSchema } from './schemas/user.chemas';
import { AdminUserService } from './services/admin-user.service';
import { UserJwtConfigService } from './services/user-jwt.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    JwtModule.registerAsync({
      useClass: UserJwtConfigService,
    }),
  ],
  providers: [UserService, AdminUserService, UserJwtStrategy],
  controllers: [UserController, AdminUserController],
  exports: [PassportModule, UserService],
})
export class UserModule implements NestModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createUserMiddleware(this.configService))
      .exclude(
        { path: 'user/get-otp', method: RequestMethod.GET },
        { path: 'user/verify-otp', method: RequestMethod.POST },
        { path: 'user/login-otp', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'user/forgot', method: RequestMethod.POST },
        { path: 'user/change-password', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
    // consumer.apply(AccountMiddleware).forRoutes(AdminUserController);
    // consumer.apply(InternalMiddleware).forRoutes(InternalController);
  }
}
