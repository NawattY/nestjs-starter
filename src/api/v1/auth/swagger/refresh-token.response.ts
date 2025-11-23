import { SwaggerHelpers } from '#api/common/swagger-helpers';
import { ERROR_CODE } from '#constants/error-code.constant';

const authExample = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODBkNTlkNi1lYWI3LTRkNWYtYWFlNS05ZWNlOWQ1MzU2MzMiLCJpYXQiOjE3NDg5NDM4MzIsImV4cCI6MTc0ODk0NzQzMn0.9HPPDoFrWDbyvMblt-_J9LKsQH3V0PLcf0tYvPXqot8',
  refreshToken: '83929ded-b2fd-42f3-871a-59847cbdff35',
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
