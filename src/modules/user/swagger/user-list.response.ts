import { unauthorizedResponse } from '#modules/auth/swagger/me.response';

const successResponse =
  '{"meta":{"itemCount":1,"totalItems":1,"itemsPerPage":20,"totalPages":1,"currentPage":1},"items":[{"id":"d80d59d6-eab7-4d5f-aae5-9ece9d535633","email":"admin@example.com","mobile":"0899999999","fullName":"Admin User","isActive":true}]}';

const userListResponse = [
  {
    status: 200,
    description: 'Ok',
    examples: {
      Success: {
        value: successResponse,
      },
    },
  },
  {
    status: 401,
    description: 'Unauthorized',
    examples: {
      'Error: Unauthorized': {
        value: unauthorizedResponse,
      },
    },
  },
];

export { userListResponse };
