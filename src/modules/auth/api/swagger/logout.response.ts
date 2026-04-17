import { SwaggerHelpers } from '@app/core/swagger/swagger-helpers';

export const logoutResponse = [
  {
    status: 204,
    description: 'No Content',
    examples: {
      Success: {
        value: {},
      },
    },
  },
  SwaggerHelpers.forbidden(),
];
