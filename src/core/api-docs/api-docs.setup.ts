import { join } from 'node:path';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';

export const OPENAPI_SPEC_URL = '/openapi/openapi.yaml';
export const API_DOCS_PATH = '/docs';

const API_DOCS_CSP = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
});

export function setupApiDocs(app: NestExpressApplication): void {
  app.useStaticAssets(join(process.cwd(), 'openapi'), {
    prefix: '/openapi/',
  });

  app.use(
    API_DOCS_PATH,
    API_DOCS_CSP,
    apiReference({
      url: OPENAPI_SPEC_URL,
      hideSearch: true,
      theme: 'default',
    }),
  );
}
