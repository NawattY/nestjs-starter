export const ERROR_CODE = {
  // Global
  VALIDATE_ERROR: 100422,
  INTERNAL_SERVER_ERROR: 100500,

  // Auth
  INVALID_CREDENTIALS: 101401,
  INVALID_REFRESH_TOKEN: 101000,

  // User
  USER_NOT_FOUND: 102404,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
