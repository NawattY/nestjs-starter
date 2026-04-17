import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

const userExample = {
  email: 'user@email.com',
  fullName: 'John Doe',
  isActive: true,
};

export const meResponse = [
  SwaggerHelpers.success(200, userExample, 'User info retrieved successfully'),
  SwaggerHelpers.forbidden(),
];
