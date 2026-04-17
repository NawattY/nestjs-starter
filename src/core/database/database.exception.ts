import { HttpStatus } from '@nestjs/common';

import { ERROR_CODE } from '../../constants/error-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';

export class DatabaseException {
  static unavailable(): never {
    throw new AppException({
      errorCode: ERROR_CODE.DATABASE_UNAVAILABLE,
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    });
  }
}
