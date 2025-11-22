import { ERROR_CODE } from '#constants/error-code.constant';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class BusinessException {
  static userSuspended(): never {
    throw new AppException({
      errorCode: ERROR_CODE.USER_SUSPENDED,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
