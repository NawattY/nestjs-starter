const PREFIX = {
  V1: 'v1',
} as const;

export const ROUTES = {
  V1: {
    AUTH: {
      ROOT: `${PREFIX.V1}/auth`,
      LOGIN: 'login',
      REFRESH: 'refresh',
      LOGOUT: 'logout',
      ME: 'me',
    },
    USER: {
      ROOT: `${PREFIX.V1}/users`,
      ME: 'me',
    },
  },
} as const;
