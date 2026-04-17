import { authConfiguration } from './auth.config';
import { databaseConfiguration } from './database.config';
import { loggerConfiguration } from './logger.config';
import { redisConfiguration } from './redis.config';

export const appConfigurations = [
	authConfiguration,
	databaseConfiguration,
	loggerConfiguration,
	redisConfiguration,
];
