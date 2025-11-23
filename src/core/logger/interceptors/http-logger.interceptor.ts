import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { randomUUID } from 'crypto';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const req = context.switchToHttp().getRequest();

    const requestId = randomUUID();
    req.requestId = requestId;

    this.logger.log(
      `Incoming request: ${req.method} ${req.url}`,
      'HTTP',
    );

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(
          `Completed ${req.method} ${req.url} - ${ms}ms`,
          'HTTP',
        );
      }),
    );
  }

  mask(obj: any) {
    const clone = { ...obj };
    const sensitive = ['password', 'token', 'refreshToken', 'accessToken'];

    for (const key of sensitive) {
      if (clone[key]) clone[key] = '***MASKED***';
    }

    return clone;
  }
}
