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
      name: 'api-not-imported-by-modules',
      severity: 'error',
      comment: 'Modules MUST NOT depend on the API layer',
      from: {
        path: '^src/modules',
      },
      to: {
        path: '^src/api',
      },
    },
    {
      name: 'business-not-imported-by-modules',
      severity: 'error',
      comment: 'Business layer MUST NOT depend on Modules (Circular Dependency Risk)',
      from: {
        path: '^src/business',
      },
      to: {
        path: '^src/modules',
        // Allow importing models if strictly necessary, but prefer decoupling.
        // For now, strictly forbid any import from modules.
      },
    },
    {
      name: 'datasources-not-depend-on-services',
      severity: 'error',
      comment: 'Datasources MUST NOT depend on Services',
      from: {
        path: '^src/modules/[^/]+/datasources',
      },
      to: {
        path: '^src/modules/[^/]+/services',
      },
    },
    {
      name: 'no-cross-module-imports',
      severity: 'error',
      comment: 'Modules MUST NOT import other modules directly (use Business layer or Events)',
      from: {
        path: '^src/modules/([^/]+)',
      },
      to: {
        path: '^src/modules/([^/]+)',
        pathNot: '^src/modules/$1', // Allow internal imports
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
