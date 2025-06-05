import { unauthorizedResponse } from './me.response';

const validateError =
  '{"status":{"code":400,"message":"Bad Request"},"error":{"code":100422,"message":"VALIDATE_ERROR","errors":["refreshToken should not be empty","refreshToken must be a string"]},"path":"/api/auth/refresh","timestamp":"2025-06-05T10:32:22.612Z"}';

const invalidToken =
  '{"status":{"code":401,"message":"Unauthorized"},"error":{"code":101000,"message":"Invalid refresh token","errors":[]},"path":"/api/auth/refresh","timestamp":"2025-06-05T10:33:05.273Z"}';

const revokeRefreshResponse = [
  {
    status: 201,
    description: 'Revoke success (No Content)',
    examples: {
      Success: {},
    },
  },
  {
    status: 401,
    description: 'Unauthorized',
    examples: {
      'Error: Unauthorized': {
        value: unauthorizedResponse,
      },
      'Error: Invalid refresh token': {
        value: invalidToken,
      },
    },
  },
  {
    status: 400,
    description: 'Bad Request',
    examples: {
      'Error: Validate Error': {
        value: validateError,
      },
    },
  },
];

export { revokeRefreshResponse };
