import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './api/modules/app.module';
import { HttpConfig, LoggerConfig } from './api/config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = configService.getOrThrow<LoggerConfig>('logger');
  const http = configService.getOrThrow<HttpConfig>('http');

  app.useLogger(
    logger.debug
      ? ['error', 'warn', 'log', 'debug', 'verbose']
      : ['log', 'error', 'warn'],
  );

  await app.listen(http.port);
}

void bootstrap();
