# NestJS Starter

A robust and scalable NestJS boilerplate designed to kickstart your backend development. This boilerplate includes pre-configured modules for common tasks, a well-defined project structure, and best practices for building enterprise-grade applications.

## ✨ Key Features

* **NestJS Framework:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
* **TypeScript:** Superset of JavaScript for type safety and better developer experience.
* **Configuration Management:** Flexible configuration loading (`.env` files) and typed configurations using `@nestjs/config`, with a clear separation between core mechanism and project-specific settings. Includes validation for environment variables.
* **Database Integration:**
    * **TypeORM:** Pre-configured for database interaction.
    * **Migrations:** Setup for database schema migrations.
    * **Seeding:** Placeholder and structure for database seeding.
* **Authentication & Authorization:** Basic setup for JWT-based authentication (can be extended).
* **Logging:** Centralized logging module. You can easily extend `LoggerService` to pipe logs to Winston, CloudWatch, or any external system.
* **Validation:** Request validation using `class-validator` and `class-transformer`.
* **Error Handling:** Global exception filter for consistent error responses.
* **Modularity:** Well-defined project structure promoting separation of concerns.
* **Testing:** Setup for unit and E2E tests with Jest.
* **API Documentation:** Automated API documentation with Swagger (OpenAPI).

## 📂 Project Structure Overview

The project structure is designed to be modular, scalable, and maintainable.

```
.
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierrc                     # Prettier configuration
├── eslint.config.mjs               # ESLint configuration
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.build.json
├── tsconfig.json
├── PROJECT_STRUCTURE.md            # Additional docs
├── doc/
│   ├── MIGRATION.md
│   └── SEED.md
│
├── src/
│   ├── main.ts                     # Application bootstrap
│   ├── app.module.ts               # Root application module
│   │
│   ├── core/
│   │   ├── config/
│   │   │   ├── config.module.ts
│   │   │   ├── config.service.ts
│   │   │   ├── validation.ts
│   │   │   └── utils/
│   │   │       └── validate-config.util.ts
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   ├── file-upload/
│   │   │   └── s3/
│   │   │       ├── s3.module.ts
│   │   │       ├── s3.service.ts
│   │   │       └── index.ts
│   │   └── logger/
│   │       ├── logger.module.ts
│   │       └── services/
│   │           └── logger.service.ts
│   │
│   ├── database/
│   │   ├── data-source.ts
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── config/
│   ├── constants/
│   ├── shared/
│   └── modules/
│       ├── auth/
│       └── user/
│
└── test/
    ├── app.e2e-spec.ts
    ├── auth.e2e-spec.ts
    ├── user.e2e-spec.ts
    └── jest-e2e.json
```

* **`src/core/`**: Contains foundational modules and services essential for the boilerplate's operation (e.g., config loading mechanism, core database module setup, logger). This part should ideally change minimally when new projects are started from this boilerplate.
* **`src/database/`**: Holds project-specific database schema definitions, migrations, seed files, and the ORM's data source configuration (`data-source.ts`) used by the CLI. This folder will evolve with the specific project.
* **`src/config/`**: Defines project-specific typed configuration objects (using `@nestjs/config`'s `registerAs` and validated by `src/core/config/utils/validate-config.util.ts`). These are loaded by the `CoreConfigModule`.
* **`src/constants/`**: Stores global constants that are specific to the project and used across multiple modules within this project.
* **`src/shared/`**: Includes reusable utilities, DTOs, interfaces, decorators, filters, guards, etc., that are generic enough to be shared by multiple feature modules *within the boilerplate's typical use case*.
* **`src/modules/`**: Houses feature-specific modules, each typically containing its own controllers, services, DTOs, entities, and constants. This is where most of the application's business logic will reside.

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.x or later recommended)
* npm (v9.x or later) or yarn
* Docker and Docker Compose (Optional, for containerized development/deployment)
* A running database instance (e.g., PostgreSQL, MySQL) accessible to the application.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git) your-project-name
    cd your-project-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

1.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and update the environment variables according to your setup (database credentials, JWT secrets, API keys, etc.). The required and optional variables are typically defined and validated via `src/core/config/validation.ts` and specific `src/config/*.config.ts` files.
3.  Environment files are loaded in the following priority: `.env.local`, `.env.$NODE_ENV.local`, `.env.$NODE_ENV`, then `.env`. This allows you to override settings per environment while keeping sane defaults in `.env.example`.

## 🚀 Running the Application

* **Development Mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```
    The application will be available at `http://localhost:PORT` (where `PORT` is defined in your `.env` file, typically 3000 or 3001).

* **Watch Mode (similar to dev):**
    ```bash
    npm run start:watch
    ```

* **Production Mode:**
    First, build the application:
    ```bash
    npm run build
    ```
    Then, run the compiled application:
    ```bash
    npm run start:prod
    ```

## 🧪 Testing

* **Run all unit tests:**
    ```bash
    npm run test
    ```

* **Run all E2E tests:**
    Ensure your database and other external services required for E2E tests are running.
    ```bash
    npm run test:e2e
    ```
    The `test/` directory includes example E2E tests such as `user.e2e-spec.ts`. Feel free to expand these with more validation and error cases.

* **Run test coverage:**
    ```bash
    npm run test:cov
    ```

## 🗃️ Database (TypeORM)

This boilerplate uses TypeORM for database interactions.

### Configuration

* The main TypeORM CLI configuration is in `src/database/data-source.ts`. This file is used by TypeORM CLI commands for migrations and other operations. It should be configured to find your entities (typically located within feature modules like `src/modules/**/*.entity.ts`) and migration files.
* The NestJS database connection module is in `src/core/database/database.module.ts`, which uses the configuration provided via the `CoreConfigService` and/or project-specific typed database configurations from `src/config/database.config.ts`.
* For advanced setups (multiple connections or read replicas), consider extending `DatabaseModule` with additional configuration files and providers.

### Migrations

Migrations are managed using TypeORM CLI commands, wrapped as npm scripts in `package.json`.

1.  **Generate a new migration:**
    (Replace `YourMigrationName` with a descriptive name, e.g., `CreateUsersTable`)
    ```bash
    npm run migration:generate --name=YourMigrationName
    ```
    This will create a new migration file in `src/database/migrations/`. Edit this file to define your schema changes.

2.  **Run pending migrations:**
    This applies all pending migrations to your database.
    ```bash
    npm run migration:run
    ```

3.  **Revert the last applied migration:**
    ```bash
    npm run migration:revert
    ```

*Note: Ensure your `NODE_ENV` and `.env` file are correctly set up so that the `data-source.ts` can connect to the correct database for migration operations.*

### Seeding

Database seeding can be handled in a few ways:

1.  **Simple Seed Files:** Place seed scripts or data files in `src/database/seeds/` and use a library like `typeorm-extension` or custom scripts to execute them.
    * Example script in `package.json` (you'll need to implement `seed:run:script`):
        ```bash
        # npm run seed:run:script
        ```
2.  **Dedicated Seed Module:** For more complex seeding logic involving NestJS services and dependency injection, a `SeedModule` is provided (optional) in `src/modules/seed/`. You can create a custom NestJS CLI command or script to trigger services within this module.
    * Example (if you implement a NestJS command for seeding):
        ```bash
        # node dist/main.js seed
        ```

## ⚙️ Configuration Management

* **Environment Variables:** Loaded from `.env` files by `src/core/config/config.module.ts`.
* **Core Validation:** Basic ENV variables required by the boilerplate can be validated using a Joi schema in `src/core/config/validation.ts`.
* **Typed Configurations:** Project-specific, structured configurations are defined in `src/config/*.config.ts` using `@nestjs/config`'s `registerAs` pattern. These are validated using `class-validator` via the utility in `src/core/config/utils/validate-config.util.ts`.
* **Environment Overrides:** You can create environment-specific files such as `.env.development` or `.env.production` to override values. The loading priority is the same as mentioned above.
* **Accessing Config:** Use the `CoreConfigService` (from `src/core/config/config.service.ts`) or inject typed configurations directly using `@Inject(config.KEY)`.

## 📄 API Documentation (Swagger)

If Swagger is enabled (typically in `main.ts`), API documentation will be available at `/api` (or your configured path) when the application is running.
Example: `http://localhost:PORT/api`

## 📜 License

This project is licensed under the [MIT License](LICENSE).

*This README provides a comprehensive guide to the boilerplate. Remember to replace placeholders like `your-username/your-repo`, and update specific examples to match your final implementation.*
