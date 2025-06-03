export const ErrorCode = {
  // Global
  VALIDATE_ERROR: 100422,
  INTERNAL_SERVER_ERROR: 100500,

  // Auth
  INVALID_CREDENTIALS: 101401,

  // User
  USER_NOT_FOUND: 102404,
} as const;
