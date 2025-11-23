import { ERROR_CODE } from './error-code.constant';

export const ERROR_MESSAGE: Record<number, string> = {
  [ERROR_CODE.VALIDATE_ERROR]: 'Validation failed',
  [ERROR_CODE.NOT_FOUND]: 'Resource not found',
  [ERROR_CODE.CONFLICT]: 'Resource already exists',
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ERROR_CODE.INVALID_CREDENTIALS]: 'Username or password is incorrect',
  [ERROR_CODE.UNAUTHORIZED]: 'Unauthorized',
  [ERROR_CODE.INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
  [ERROR_CODE.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODE.USER_SUSPENDED]: 'User account is suspended',
};
