import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { SKIP_RESPONSE_WRAP } from '../decorators/skipResponseWrap.decorator'

export interface ApiResponse<T> {
  data: T
  statusCode: number
}

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<unknown> | unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE_WRAP, [
      context.getHandler(),
      context.getClass()
    ])

    if (skip) return next.handle()

    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>()

    return next.handle().pipe(
      map((data) => {
        if (response.statusCode === HttpStatus.NO_CONTENT) return data
        return { data, statusCode: response.statusCode }
      })
    )
  }
}
