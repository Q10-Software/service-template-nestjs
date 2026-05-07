import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { LoggerService } from './logger.service'

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly appLogger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint()
    const requestId = this.resolveRequestId(req)

    res.setHeader('x-request-id', requestId)

    res.on('finish', () => {
      const latencyMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
      const route =
        (req.route as { path?: string })?.path ?? req.originalUrl ?? req.url
      const statusCode = res.statusCode
      const level =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log'

      if (!this.appLogger[level]) {
        return
      }

      this.appLogger[level]('HTTP request completed', {
        event: 'http.request.completed',
        context: 'HttpRequest',
        requestId,
        http: {
          method: req.method,
          route,
          statusCode,
          latencyMs: Math.round(latencyMs)
        },
        meta: {
          userAgent: req.headers['user-agent'],
          remoteAddress: req.ip
        }
      })
    })

    next()
  }

  private resolveRequestId(req: Request): string {
    const headerValue = req.headers['x-request-id']
    if (typeof headerValue === 'string' && headerValue.length) {
      return headerValue
    }

    return randomUUID()
  }
}
