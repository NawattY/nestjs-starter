import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR_MESSAGE } from '../../constants/error-message.constant';

interface AppExceptionOptions {
  errorCode: number;
  statusCode: HttpStatus;
  errors?: string[];
}

export class AppException extends HttpException {
  public readonly errorCode: number;
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]> | string[];

  constructor(options: AppExceptionOptions) {
    const { errorCode, statusCode = HttpStatus.INTERNAL_SERVER_ERROR, errors } = options;

    super(
      {
        errorCode,
        errorMessage: ERROR_MESSAGE[errorCode] ?? 'Unknown error',
        errors,
      },
      statusCode,
    );

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
