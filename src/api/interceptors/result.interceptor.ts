import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '@shared/domain/result/result';
import { domainErrorToHttpException } from './domainError.map';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof Result)) return data;

        if (data.isOk) return data.value;

        throw domainErrorToHttpException(data.error);
      }),
    )
  }
}
