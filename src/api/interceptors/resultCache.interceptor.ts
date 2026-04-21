import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '@shared/domain/result/result';
import { domainErrorToHttpException } from './domainError.map';

@Injectable()
export class ResultCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    return super.intercept(context, {
      handle: () =>
        next.handle().pipe(
          map((data) => {
            if (!(data instanceof Result)) return data;
            if (data.isFail) throw domainErrorToHttpException(data.error);
            return data.value;
          }),
        ),
    });
  }
}
