import { ErrorCode } from '#shared/constants/error-code.constant';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserAuthException {
  static credentialMismatch(): never {
    throw new AppException({
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: ErrorCode.INVALID_CREDENTIALS,
      errorMessage: 'Username or password is incorrect',
    });
  }
}
