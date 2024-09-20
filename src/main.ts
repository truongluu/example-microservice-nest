import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjsmcs/core';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(configService.get('app.prefix'));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const options = new DocumentBuilder()
    .setBasePath(configService.get('app.prefix'))
    .setTitle('Auth API')
    .setDescription('Auth microservice API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'adminAuth')
    .addBearerAuth({ type: 'http' }, 'userAuth')
    .addBearerAuth({ type: 'http' }, 'partnerAuth')
    .addBearerAuth({ type: 'http' }, 'internalAuth')

    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(
    configService.get('app.port'),
    configService.get('app.host'),
  );
}
bootstrap();
