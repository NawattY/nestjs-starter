src/
├── app.module.ts
├── main.ts
├── common/                    # NestJS Framework Components
│   ├── decorators/            # Custom decorators
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── filters/               # Exception filters
│   │   ├── http-exception.filter.ts
│   │   └── validation-exception.filter.ts
│   ├── guards/                # Guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/          # Interceptors
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/                 # Validation pipes
│   │   ├── validation.pipe.ts
│   │   └── parse-int.pipe.ts
│   ├── dto/                   # Base DTOs
│   │   ├── pagination.dto.ts
│   │   └── base-response.dto.ts
│   └── middleware/            # Custom middleware
│       └── logger.middleware.ts
├── shared/                    # Business Utilities
│   ├── services/              # Shared business services
│   │   ├── email.service.ts
│   │   ├── file-upload.service.ts
│   │   └── notification.service.ts
│   ├── interfaces/            # TypeScript interfaces
│   │   ├── api-response.interface.ts
│   │   ├── pagination.interface.ts
│   │   └── user.interface.ts
│   ├── constants/             # Application constants
│   │   ├── app.constants.ts
│   │   ├── error-messages.ts
│   │   └── status-codes.ts
│   ├── utils/                 # Helper functions
│   │   ├── date.util.ts
│   │   ├── string.util.ts
│   │   └── validation.util.ts
│   ├── enums/                 # Enums
│   │   ├── user-status.enum.ts
│   │   └── order-status.enum.ts
│   └── types/                 # Type definitions
│       ├── api.types.ts
│       └── common.types.ts
├── core/                      # Core System Components (Modular)
│   ├── base/                  # Required Base Components
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── base.entity.ts
│   │   │   ├── migrations/
│   │   │   │   └── .gitkeep
│   │   │   └── database.providers.ts
│   │   ├── config/
│   │   │   └── config.module.ts
│   │   └── health/
│   │       ├── health.module.ts
│   │       └── health.controller.ts
│   ├── auth/                  # Optional - Authentication System
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   ├── migrations/
│   │   │   ├── 001-create-sessions-table.ts
│   │   │   └── .gitkeep
│   │   ├── seeds/
│   │   │   └── .gitkeep
│   │   └── interfaces/
│   │       └── auth.interface.ts
│   ├── user-management/       # Optional - User Management
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   └── permission.entity.ts
│   │   ├── migrations/
│   │   │   ├── 001-create-users-table.ts
│   │   │   ├── 002-create-roles-table.ts
│   │   │   └── 003-create-permissions-table.ts
│   │   └── seeds/
│   │       ├── 001-default-roles.seed.ts
│   │       └── 002-admin-user.seed.ts
│   ├── cache/                 # Optional - Cache System
│   │   ├── cache.module.ts
│   │   └── cache.service.ts
│   ├── queue/                 # Optional - Job Queue
│   │   ├── queue.module.ts
│   │   └── queue.service.ts
│   ├── file-upload/           # Optional - File Upload
│   │   ├── upload.module.ts
│   │   ├── upload.service.ts
│   │   └── storage/
│   │       └── .gitkeep
│   ├── logging/               # Optional - Advanced Logging
│   │   ├── logger.module.ts
│   │   └── logger.service.ts
│   └── index.ts               # Core exports
├── config/                    # Configuration Management
│   ├── configuration.ts       # Main config loader
│   ├── interfaces/
│   │   └── config.interface.ts
│   ├── envs/                  # Environment-specific configs
│   │   ├── development.ts
│   │   ├── production.ts
│   │   └── test.ts
│   ├── database.config.ts     # Database configurations
│   ├── jwt.config.ts          # JWT configurations
│   ├── cache.config.ts        # Cache configurations
│   ├── upload.config.ts       # File upload configurations
│   ├── features.config.ts     # Feature flags
│   └── validation.schema.ts   # Joi validation schema
├── database/                  # Project-Specific Database
│   ├── migrations/            # Business migrations
│   │   └── .gitkeep
│   └── seeds/                 # Business seeds
│       └── .gitkeep
├── modules/                   # Business Modules (Project-Specific)
│   └── .gitkeep               # Keep folder for boilerplate
├── examples/                  # Example Implementations
│   ├── crud/
│   │   ├── example.controller.ts
│   │   ├── example.service.ts
│   │   ├── example.module.ts
│   │   ├── dto/
│   │   │   ├── create-example.dto.ts
│   │   │   └── update-example.dto.ts
│   │   └── entities/
│   │       └── example.entity.ts
│   ├── auth-usage/
│   │   └── protected.controller.ts
│   ├── file-upload/
│   │   └── upload.controller.ts
│   └── README.md
└── scripts/                   # Project Scripts
    ├── seed.ts
    ├── migration.ts
    └── setup-project.sh