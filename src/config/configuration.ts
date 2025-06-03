export const configuration = () => ({
  env: process.env.NODE_ENV ?? 'development',
  projectName: process.env.PROJECT_NAME ?? 'nestjs-app',
  timezone: process.env.TZ ?? 'UTC',

  app: {
    host: process.env.APP_HOST ?? 'localhost',
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
  },

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    debug: process.env.DB_DEBUG === 'true',
    enableQueryLog: process.env.DB_ENABLE_QUERY_LOG === 'true',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
