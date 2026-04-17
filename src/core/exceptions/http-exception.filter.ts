import { ERROR_CODE } from '@app/constants/error-code.constant';
import { ERROR_MESSAGE } from '@app/constants/error-message.constant';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get, toInteger, toString } from 'lodash';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: number = ERROR_CODE.INTERNAL_SERVER_ERROR;
    let errorMessage: string = 'INTERNAL_SERVER_ERROR';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      status = exception.getStatus();

      if (
        typeof res === 'object' &&
        res !== null &&
        'errorCode' in res &&
        'errorMessage' in res
      ) {
        // เป็น AppException ที่เราสร้างเอง
        errorCode = toInteger(res.errorCode);
        errorMessage = toString(res.errorMessage);
        errors = get(res, 'errors') ?? [];
      } else if (
        typeof res === 'object' &&
        'message' in res &&
        Array.isArray(res.message)
      ) {
        // ⚠️ ValidationPipe error format
        status = HttpStatus.BAD_REQUEST;
        errorCode = ERROR_CODE.VALIDATE_ERROR;
        errorMessage =
          ERROR_MESSAGE[ERROR_CODE.VALIDATE_ERROR] ?? 'VALIDATE ERROR';
        errors = res.message;
      } else if (typeof res === 'string') {
        errorMessage = res;
      } else {
        errorMessage =
          get(res, 'error') ?? get(res, 'message') ?? 'HTTP_EXCEPTION_ERROR';
        const message = get(res, 'message');
        if (typeof message === 'string') {
          errors = [message];
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
