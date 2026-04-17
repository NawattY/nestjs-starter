import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

const updatedUserExample = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  mobile: '0999999999',
  email: 'john.updated@example.com',
  firstName: 'John Updated',
  lastName: 'Doe Updated',
  status: 'active',
  createdAt: '2025-01-15T10:30:00.000Z',
  updatedAt: '2025-01-22T01:15:00.000Z',
};

export const updateMeResponse = [
  SwaggerHelpers.success(200, updatedUserExample, 'User profile updated successfully'),
  SwaggerHelpers.validationError({ email: ['email must be an email'] }),
  SwaggerHelpers.unauthorized(),
];