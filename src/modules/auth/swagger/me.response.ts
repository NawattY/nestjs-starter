const userInfo =
  '{"id":"9d0f6da7-7b47-4119-8e52-26fccab09117","email":"user@email.com","fullName":"John Doe","isActive":true}';

const unauthorizedResponse =
  '{"status":{"code":401,"message":"Unauthorized"},"error":{"code":100500,"message":"Unauthorized","errors":["Unauthorized"]},"path":"/api/auth/revoke","timestamp":"2025-06-05T10:44:07.575Z"}';

const meResponse = [
  {
    status: 200,
    description: 'Ok',
    examples: {
      Success: {
        value: userInfo,
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

export { meResponse, unauthorizedResponse };
