import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './api/modules/app.module';
import { HttpConfig } from './api/config/config.types';
import { LoggerService } from './api/modules/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  const httpConfig = configService.getOrThrow<HttpConfig>('http');

  app.useLogger(loggerService);

  await app.listen(httpConfig.port);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
