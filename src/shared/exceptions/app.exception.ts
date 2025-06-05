import { HttpException, HttpStatus } from '@nestjs/common';

interface AppExceptionOptions {
  statusCode: HttpStatus;
  errorCode: number;
  errorMessage: string;
  errors?: string[];
}

export class AppException extends HttpException {
  constructor({
    statusCode,
    errorCode,
    errorMessage,
    errors,
  }: AppExceptionOptions) {
    super(
      {
        errorCode,
        errorMessage,
        errors,
      },
      statusCode,
    );
  }
}
