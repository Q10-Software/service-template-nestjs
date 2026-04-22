import { Controller, Get } from '@nestjs/common';

import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { SkipResponseWrap } from '../../decorators/skipResponseWrap.decorator';

@SkipResponseWrap()
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  execute() {
    return this.health.check([
      () => this.memory.checkHeap('memory', 150 * 1024 * 1024),
    ]);
  }

  @Get('/debug')
  getError() {
    throw new Error(`Debug error! -> at ${new Date().toISOString()}`);
  }
}
