const authSuccessJson =
  '{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODBkNTlkNi1lYWI3LTRkNWYtYWFlNS05ZWNlOWQ1MzU2MzMiLCJpYXQiOjE3NDg5NDM4MzIsImV4cCI6MTc0ODk0NzQzMn0.9HPPDoFrWDbyvMblt-_J9LKsQH3V0PLcf0tYvPXqot8","refreshToken":"83929ded-b2fd-42f3-871a-59847cbdff35","userId":"d80d59d6-eab7-4d5f-aae5-9ece9d535633"}';

const validateError =
  '{"status":{"code":400,"message":"Bad Request"},"error":{"code":100422,"message":"VALIDATE_ERROR","errors":["username should not be empty","password should not be empty","password must be a string"]},"path":"/api/auth/login","timestamp":"2025-06-03T09:42:06.643Z"}';

const credentialsMismatchError =
  '{"status":{"code":401,"message":"Unauthorized"},"error":{"code":101401,"message":"Username or password is incorrect","errors":[]},"path":"/api/auth/login","timestamp":"2025-06-03T09:39:40.604Z"}';

const loginResponse = [
  {
    status: 200,
    description: 'User list returned successfully',
    examples: {
      Success: {
        value: authSuccessJson,
      },
    },
  },
  {
    status: 401,
    description: 'Unauthorized',
    examples: {
      'Error: Credentials Mismatch': {
        value: credentialsMismatchError,
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

export { loginResponse, authSuccessJson };
