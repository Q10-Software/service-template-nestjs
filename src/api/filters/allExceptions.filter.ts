import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import type { Request, Response } from 'express';
import { LoggerService } from '../modules/logging/logger.service';
import { DomainErrorType } from '@shared/domain/errors/domainErrors.constants';
import { type DomainErrorHttpBody } from '../interceptors/domainError.map';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger.setContext('AllExceptionsFilter');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.resolveException(exception);

    if (status >= 500) {
      const err = exception instanceof Error ? exception : new Error(String(exception));
      this.logger.error(`Unhandled exception on ${request.method} ${request.url}`, {
        error: { name: err.name, message: err.message, stack: err.stack },
      });
      Sentry.captureException(exception);
    }

    response.status(status).json({ error: body, statusCode: status });
  }

  private resolveException(exception: unknown): { status: number; body: DomainErrorHttpBody } {
    if (!(exception instanceof HttpException)) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          type: DomainErrorType.UNKNOWN,
          code: `INTERNAL.${DomainErrorType.UNKNOWN}`,
          context: 'INTERNAL',
          message: 'Internal server error',
        },
      };
    }

    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    if (this.isDomainErrorBody(responseBody)) {
      return { status, body: responseBody };
    }

    return {
      status,
      body: {
        type: DomainErrorType.UNKNOWN,
        code: `HTTP.${DomainErrorType.UNKNOWN}`,
        context: 'HTTP',
        message: exception.message,
      },
    };
  }

  private isDomainErrorBody(body: unknown): body is DomainErrorHttpBody {
    return (
      typeof body === 'object' &&
      body !== null &&
      'type' in body &&
      'code' in body &&
      'context' in body &&
      'origin' in body &&
      'message' in body
    );
  }
}
