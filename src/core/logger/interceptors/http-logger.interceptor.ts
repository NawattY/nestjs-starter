import { randomUUID } from 'node:crypto';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { LoggerService } from '../services/logger.service';

type RequestWithId = Request & {
  requestId?: string;
};

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest<RequestWithId>();

    const requestId = randomUUID();
    req.requestId = requestId;

    this.logger.log(`Incoming request: ${req.method} ${req.url}`, 'HTTP');

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(`Completed ${req.method} ${req.url} - ${ms}ms`, 'HTTP');
      }),
    );
  }

  mask<T extends Record<string, unknown>>(obj: T): T {
    const clone: Record<string, unknown> = { ...obj };
    const sensitive = ['password', 'token', 'refreshToken', 'accessToken'];

    for (const key of sensitive) {
      if (clone[key] !== undefined) {
        clone[key] = '***MASKED***';
      }
    }

    return clone as T;
  }
}
