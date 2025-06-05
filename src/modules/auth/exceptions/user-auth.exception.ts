import { APP_ERROR_CODE } from '#constants/error-codes.constants';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserAuthException {
  static credentialMismatch(): never {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: APP_ERROR_CODE.INVALID_CREDENTIALS,
      errorMessage: 'Username or password is incorrect',
    });
  }

  static invalidRefreshToken(): never {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: APP_ERROR_CODE.INVALID_REFRESH_TOKEN,
      errorMessage: 'Invalid refresh token',
    });
  }
}
