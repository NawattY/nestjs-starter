import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';

import { setupApiDocs } from '../../api-docs/api-docs.setup';
import { createValidationPipe } from '../../pipes';

const ALLOWED_CORS_ORIGINS = new Set(['http://localhost:3000', 'https://api.yourdomain.com']);

const CORS_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

export const API_GLOBAL_PREFIX = 'api';

function isAllowedCorsOrigin(origin: string | undefined): boolean {
  return !origin || ALLOWED_CORS_ORIGINS.has(origin);
}

export function configureApp(app: NestExpressApplication): void {
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

  setupApiDocs(app);
}
