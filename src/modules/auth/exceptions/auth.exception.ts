import { ERROR_CODE } from '@app/constants/error-code.constant';
import { AppException } from '@app/shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthException {
  static unauthorized(): never {
    throw new AppException({
      errorCode: ERROR_CODE.UNAUTHORIZED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  static credentialMismatch(): never {
    throw new AppException({
      errorCode: ERROR_CODE.INVALID_CREDENTIALS,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  static invalidRefreshToken(): never {
    throw new AppException({
      errorCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
