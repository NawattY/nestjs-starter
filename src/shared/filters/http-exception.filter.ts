import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'lodash';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 100500;
    let errorMessage = 'INTERNAL_SERVER_ERROR';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      status = exception.getStatus();

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        if ('message' in res && Array.isArray(res.message)) {
          // ⚠️ ValidationPipe error format
          errorCode = 100422;
          errorMessage = 'VALIDATE_ERROR';
          errors = res.message;
        } else {
          errorMessage =
            get(res, 'error') ?? get(res, 'message') ?? 'HTTP_EXCEPTION_ERROR';

          const message = get(res, 'message');
          if (typeof message === 'string') {
            errors = [message];
          }
        }
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    response.status(status).json({
      status: {
        code: status,
        message: this.getStatusText(status),
      },
      error: {
        code: errorCode,
        message: errorMessage,
        errors,
      },
      path: request.url,
      timestamp: new Date().toISOString(),
      stack:
        process.env.NODE_ENV !== 'production'
          ? get(exception, 'stack')
          : undefined,
    });
  }

  private getStatusText(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return map[status] || 'Error';
  }
}
