import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';
import { ERROR_CODE } from '@app/constants/error-code.constant';

const authExample = {
  accessToken: 'sample-access-token',
  refreshToken: 'sample-refresh-token',
};

export const refreshResponse = [
  SwaggerHelpers.success(200, authExample, 'Token refreshed successfully'),
  SwaggerHelpers.validationError({
    refreshToken: ['refreshToken should not be empty', 'refreshToken must be a string'],
  }),
  SwaggerHelpers.customError(
    401,
    ERROR_CODE.INVALID_REFRESH_TOKEN,
    'Invalid refresh token',
    'Invalid Refresh Token',
  ),
  SwaggerHelpers.unauthorized(),
];