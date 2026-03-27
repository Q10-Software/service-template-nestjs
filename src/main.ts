import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/modules/app.module';

function isDebugEnv(): boolean {
  const v = process.env.DEBUG;
  return v === '1' || v === 'true';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: isDebugEnv()
      ? ['error', 'warn', 'log', 'debug', 'verbose']
      : ['log', 'error', 'warn'],
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
