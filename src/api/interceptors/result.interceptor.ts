import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '@shared/domain/result/result';
import { domainErrorToHttpException } from './domainError.map';
import { LoggerService } from '../modules/logging/logger.service';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(private readonly _logger: LoggerService) {
    this.logger = _logger.setContext('ResultInterceptor');
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof Result)) {
          this.logger.warn('Response is not a Result');
          return data;
        }

        if (data.isOk) {
          return data.value;
        }

        throw domainErrorToHttpException(data.error);
      }),
    )
  }
}
