/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* RULES */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This module depends on something that eventually depends back on it',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'datasources-not-depend-on-application-services',
      severity: 'error',
      comment: 'Infrastructure datasources MUST NOT depend on application service implementations',
      from: {
        path: '^src/modules/[^/]+/infrastructure/datasources',
      },
      to: {
        path: '^src/modules/[^/]+/application/.*service',
      },
    },
    {
      name: 'api-not-import-domain-or-infrastructure',
      severity: 'error',
      comment: 'API layer MUST NOT depend on domain or infrastructure layers directly',
      from: {
        path: '^src/modules/[^/]+/api',
      },
      to: {
        path: '^src/modules/[^/]+/(domain|infrastructure)',
      },
    },
    {
      name: 'api-not-import-other-modules',
      severity: 'error',
      comment: 'API layer MUST NOT depend on other feature modules directly',
      from: {
        path: '^src/modules/([^/]+)/api',
      },
      to: {
        path: '^src/modules/([^/]+)',
        pathNot: '^src/modules/$1', // Allow internal imports
      },
    },
    {
      name: 'application-not-import-api-layer',
      severity: 'error',
      comment: 'Application layer MUST NOT depend on any API layer',
      from: {
        path: '^src/modules/[^/]+/application',
      },
      to: {
        path: '^src/modules/[^/]+/api',
      },
    },
    {
      name: 'application-not-import-non-application-layers-of-other-modules',
      severity: 'error',
      comment: 'Application layer may only depend on another feature module through its application layer',
      from: {
        path: '^src/modules/([^/]+)/application',
      },
      to: {
        path: '^src/modules/([^/]+)/(api|domain|infrastructure|exceptions)',
        pathNot: '^src/modules/$1',
      },
    },
    {
      name: 'domain-not-import-framework-or-core',
      severity: 'error',
      comment: 'Domain layer MUST stay pure and avoid framework, core, config, or database dependencies',
      from: {
        path: '^src/modules/[^/]+/domain',
      },
      to: {
        path: '^(src/(core|config|database)|@nestjs|@prisma|class-transformer|class-validator|nestjs-cls)',
      },
    },
    {
      name: 'domain-and-infrastructure-not-import-other-modules',
      severity: 'error',
      comment: 'Domain and infrastructure layers MUST NOT depend on other feature modules directly',
      from: {
        path: '^src/modules/([^/]+)/(domain|infrastructure)',
      },
      to: {
        path: '^src/modules/([^/]+)',
        pathNot: '^src/modules/$1',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },
  },
};
