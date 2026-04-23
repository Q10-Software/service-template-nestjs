import { Injectable } from '@nestjs/common';
import {
  type BuildPinoLoggerOptions,
  PinoLoggerAdapter,
} from '@shared/infrastructure/adapters/pinoLogger.adapter';


@Injectable()
export class LoggerService extends PinoLoggerAdapter {
  private readonly _opts: BuildPinoLoggerOptions;

  constructor(options: BuildPinoLoggerOptions, includeStack: boolean) {
    super(options, includeStack);
  }

  setContext(context: string): LoggerService {
    return super.setContext(context) as LoggerService;
  }
}
