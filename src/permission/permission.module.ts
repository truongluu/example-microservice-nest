import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createAccountMiddleware } from '@nestjsmcs/core';
import { PermissionService } from './permission.service';
import { PermissionController } from './permisson.controller';
import { PermissionSchema } from './schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Permission', schema: PermissionSchema },
    ]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule implements NestModule {
  public constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(createAccountMiddleware(this.configService))
      .forRoutes(PermissionController);
  }
}
