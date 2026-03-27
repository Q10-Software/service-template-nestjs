import { Module } from '@nestjs/common';
import { AppInfoModule } from './appInfo/appInfo.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AppInfoModule, HealthModule],
})
export class AppModule {}
