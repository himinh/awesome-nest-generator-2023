import { ValidationError } from 'class-validator';
import { ConfigName } from '~config/environment';
import { AllExceptionsFilter } from '~exception/all-exceptions.filter';
import { SeedService } from '~lazy-modules/seed/seed.service';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { ValidationExceptions } from './utils/exceptions/validation.exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // set global prefix
  app.setGlobalPrefix('api');

  // enableCors
  app.enableCors();

  // Validation pipe in global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => new ValidationExceptions(errors),
    }),
  );

  // Catch all Exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Config swagger
  const config = new DocumentBuilder().setTitle('NestA 2023').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Server run at port
  const port = configService.get(ConfigName.app).port;

  await app.listen(port, () => {
    Logger.log(`The server is running on: http://localhost:${port}/api`, 'Main');
  });

  // Get a list of all the registered routes
  const server = app.getHttpServer();
  const router = server._events.request._router;

  await app.get<SeedService>(SeedService).seedEndpoints(router.stack);
}

bootstrap();
