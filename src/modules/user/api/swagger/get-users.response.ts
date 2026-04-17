import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

const userExample = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    mobile: '0999999999',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    status: 'active',
    createdAt: '2025-01-15T10:30:00.000Z',
    updatedAt: '2025-01-15T10:30:00.000Z',
  },
];

export const getUsersResponse = [
  SwaggerHelpers.paginated(userExample, 'Users retrieved successfully'),
  SwaggerHelpers.unauthorized(),
];
