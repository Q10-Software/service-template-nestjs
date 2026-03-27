import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppInfoModule } from './appInfo/appInfo.module';
import { HealthModule } from './health/health.module';
import { ApiConfigModule } from '../config/config.module';
import { LoggingModule } from './logging/logging.module';
import { RequestLoggingMiddleware } from './logging/requestLogging.middleware';

@Module({
  imports: [ApiConfigModule, LoggingModule, AppInfoModule, HealthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
