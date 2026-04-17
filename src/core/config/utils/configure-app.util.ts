import { createValidationPipe } from '@app/core/pipes';
import { setupSwagger } from '@app/core/swagger/swagger.setup';
import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

const ALLOWED_CORS_ORIGINS = new Set(['http://localhost:3000', 'https://api.yourdomain.com']);

const CORS_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

export const API_GLOBAL_PREFIX = 'api';

function isAllowedCorsOrigin(origin: string | undefined): boolean {
  return !origin || ALLOWED_CORS_ORIGINS.has(origin);
}

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.enableShutdownHooks();

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, isAllowedCorsOrigin(origin));
    },
    methods: CORS_METHODS,
    credentials: true,
  });

  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(
    createValidationPipe({
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  setupSwagger(app);
}
