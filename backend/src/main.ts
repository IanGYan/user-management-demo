import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  ValidationExceptionFilter,
} from './common/filters';
import { ResponseInterceptor, LoggingInterceptor } from './common/interceptors';

/**
 * Bootstrap the NestJS application
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configService = app.get(ConfigService);

  // Set global API prefix
  const apiPrefix = configService.get<string>('apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup global exception filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  // Setup global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
  });

  // Get port from configuration
  const port = configService.get<number>('port', 3001);

  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
