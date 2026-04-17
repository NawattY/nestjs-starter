import { HttpStatus } from '@nestjs/common';

import { ERROR_CODE } from '../../../constants/error-code.constant';
import { AppException } from '../../../shared/exceptions/app.exception';

export class UserException {
  static userSuspended(): never {
    throw new AppException({
      errorCode: ERROR_CODE.USER_SUSPENDED,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
