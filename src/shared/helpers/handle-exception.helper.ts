import { HttpStatus } from '@nestjs/common';

import { AppException } from '../exceptions/app.exception';

export function handleException(
  err: unknown,
  fallbackMessage: string,
  fallbackCode: number,
  fallbackStatus = HttpStatus.INTERNAL_SERVER_ERROR,
) {
  if (err instanceof AppException) throw err;

  return new AppException({
    errorCode: fallbackCode,
    statusCode: fallbackStatus,
  });
}
