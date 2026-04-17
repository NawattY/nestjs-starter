import { ERROR_CODE } from '@app/constants/error-code.constant';
import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

const authExample = {
  accessToken: 'sample-access-token',
  refreshToken: 'sample-refresh-token',
};

export const loginResponse = [
  SwaggerHelpers.success(200, authExample, 'Login successful'),
  SwaggerHelpers.validationError({
    username: ['username should not be empty'],
    password: ['password should not be empty', 'password must be a string'],
  }),
  SwaggerHelpers.customError(
    401,
    ERROR_CODE.INVALID_CREDENTIALS,
    'Username or password is incorrect',
    'Credentials Mismatch',
  ),
  SwaggerHelpers.unauthorized(),
];
