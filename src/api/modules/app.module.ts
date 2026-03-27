import { Module } from '@nestjs/common';
import { AppInfoModule } from './appInfo/appInfo.module';
import { HealthModule } from './health/health.module';
import { ApiConfigModule } from '../config/config.module';

@Module({
  imports: [ApiConfigModule, AppInfoModule, HealthModule],
})
export class AppModule {}
