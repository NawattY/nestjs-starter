import { authConfiguration } from './auth.config';
import { databaseConfiguration } from './database.config';
import { loggerConfiguration } from './logger.config';
import { redisConfiguration } from './redis.config';

export default [authConfiguration, databaseConfiguration, loggerConfiguration, redisConfiguration];
