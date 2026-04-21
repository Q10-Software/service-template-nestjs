import '../instrument';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { HttpConfig } from './config/config.types';
import { LoggerService } from './modules/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  const httpConfig = configService.getOrThrow<HttpConfig>('http');

  app.useLogger(loggerService);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  return app.listen(httpConfig.port);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
