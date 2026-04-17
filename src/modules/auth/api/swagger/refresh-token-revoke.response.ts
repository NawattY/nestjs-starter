import { ERROR_CODE } from '@app/constants/error-code.constant';
import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

export const revokeRefreshResponse = [
  {
    status: 201,
    description: 'Revoke success (No Content)',
    examples: {
      Success: {
        value: {},
      },
    },
  },
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
