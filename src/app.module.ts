import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HttpErrorFilter,
  LoggerMiddleware,
  LoggingInterceptor,
} from '@nestjsmcs/core';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { allConfigs } from './config';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
const ENV = process.env.NODE_ENV || 'development';

mongoose.set('debug', ENV === 'development');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.resolve(process.cwd(), 'environments', `.env.${ENV}`)],
      load: allConfigs,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get('database.uri'),
          dbName: config.get('database.name'),
          auth: {
            username: config.get('database.user'),
            password: config.get('database.password'),
          },
          keepAlive: true,
          useUnifiedTopology: true,
          connectTimeoutMS: 30000,
          useNewUrlParser: true,
          retryAttempts: 10,
        };
      },
    }),
    UserModule,
    PermissionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
