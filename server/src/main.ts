import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const MAX_BODY_SIZE = 262144000;
  const MAX_PARAM_SIZE = 100;

  const fastifyAdapter = new FastifyAdapter({
    maxParamLength: MAX_PARAM_SIZE,
    bodyLimit: MAX_BODY_SIZE,
    trustProxy: true,
    logger: true,
  });

  fastifyAdapter.register(fastifyMultipart, {});

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.enableCors({
    // origin: 'http://localhost:3000', // Update to your frontend origin
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //if (process.env.ENVIRONMENT === 'development') {
  const config = new DocumentBuilder()
    .setTitle('Appium Test Automation')
    .setDescription(
      'This project is an API built with NestJS for automating tests on mobile devices using Appium. It provides endpoints to run tests on specified devices with customizable parameters.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'api-key-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Use the new options object to specify the port and host
  await app.listen({
    port: Number(process.env.CUSTOM_SERVER_PORT) || 5000,
    host: 'localhost',
  });
}

bootstrap();
