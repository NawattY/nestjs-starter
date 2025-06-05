import { APP_ERROR_CODE } from '#constants/error-codes.constants';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserException {
  static notFound(): never {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: APP_ERROR_CODE.USER_NOT_FOUND,
      errorMessage: 'User not found.',
    });
  }
}
