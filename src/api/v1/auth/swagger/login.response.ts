import { SwaggerHelpers } from '#api/common/swagger-helpers';
import { ERROR_CODE } from '#constants/error-code.constant';

const authExample = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODBkNTlkNi1lYWI3LTRkNWYtYWFlNS05ZWNlOWQ1MzU2MzMiLCJpYXQiOjE3NDg5NDM4MzIsImV4cCI6MTc0ODk0NzQzMn0.9HPPDoFrWDbyvMblt-_J9LKsQH3V0PLcf0tYvPXqot8',
  refreshToken: '83929ded-b2fd-42f3-871a-59847cbdff35',
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
