import { ErrorCode } from '#shared/constants/error-code.constant';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserAuthException {
  static userNotFound() {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: ErrorCode.USER_NOT_FOUND,
      errorMessage: 'Username or password is incorrect',
    });
  }

  static credentialMismatch() {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: ErrorCode.INVALID_CREDENTIALS,
      errorMessage: 'Username or password is incorrect',
    });
  }
}
