import { SwaggerHelpers } from '#api/common/swagger-helpers';

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
