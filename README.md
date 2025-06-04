# [Project Title] - NestJS Boilerplate

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
* **Logging:** Centralized logging module.
* **Validation:** Request validation using `class-validator` and `class-transformer`.
* **Error Handling:** Global exception filter for consistent error responses.
* **Modularity:** Well-defined project structure promoting separation of concerns.
* **Docker Support:** Includes `Dockerfile` and `docker-compose.yml` for easy containerization.
* **Testing:** Setup for unit and E2E tests with Jest.
* **API Documentation:** Automated API documentation with Swagger (OpenAPI).

## 📂 Project Structure Overview

The project structure is designed to be modular, scalable, and maintainable.

```
.
├── .env.example                    # ตัวอย่างไฟล์ Environment Variables
├── .eslintignore
├── .eslintrc.js                    # ESLint Configuration
├── .gitignore
├── .prettierignore
├── .prettierrc.js                  # Prettier Configuration
├── docker-compose.yml              # (Optional) สำหรับ Docker
├── Dockerfile                      # (Optional) สำหรับ Docker
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
│
├── src/
│   ├── main.ts                     # ไฟล์เริ่มต้นสำหรับ bootstrap แอปพลิเคชัน
│   ├── app.module.ts               # โมดูลหลักของแอปพลิเคชัน
│   │
│   ├── core/                       # Boilerplate's Core: กลไกพื้นฐาน, ไม่ควรเปลี่ยนบ่อยเมื่อเริ่มโปรเจกต์ใหม่
│   │   ├── config/                 #   - กลไกการจัดการ Configuration
│   │   │   ├── config.module.ts    #     - CoreConfigModule (setup @nestjs/config, load .env, load project configs from src/config/)
│   │   │   ├── config.service.ts   #     - CoreConfigService (wrapper service สำหรับเข้าถึง config)
│   │   │   ├── validation.ts       #     - (Joi) Schema สำหรับ validate ENV vars พื้นฐานที่ Boilerplate คาดหวัง
│   │   │   └── utils/
│   │   │       └── validate-config.util.ts # - Utility function กลางสำหรับ validate project-specific typed configs
│   │   │
│   │   ├── database/               #   - กลไกการเชื่อมต่อฐานข้อมูลของ NestJS
│   │   │   └── database.module.ts  #     - CoreDatabaseModule (e.g., TypeOrmModule.forRootAsync() โดยใช้ DataSource จาก src/database/data-source.ts)
│   │   │
│   │   ├── logger/                 # ระบบ Logging ส่วนกลาง
│   │   │   ├── logger.module.ts    #   - โมดูลสำหรับให้บริการ LoggerService
│   │   │   ├── logger.module.ts    #   - เซอร์วิสสำหรับการ Log (อาจจะ wrap Winston หรือ NestJS Logger)
│   │   │   ├── logger.interface.ts #   - (Optional) Interface สำหรับ Logger (ถ้ามีการ implement เอง)
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก logger/
│   │   │
│   │   ├── caching/                # (ตัวอย่าง) กลไก Caching
│   │   │   ├── caching.module.ts   #   - โมดูลสำหรับตั้งค่าและให้บริการ Caching
│   │   │   ├── caching.service.ts  #   - เซอร์วิสสำหรับจัดการ Cache
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก caching/
│   │   │
│   │   ├── mailing/                # (ตัวอย่าง) กลไกการส่ง Email
│   │   │   ├── mailing.module.ts   #   - โมดูลสำหรับตั้งค่าและให้บริการ Mailing
│   │   │   ├── mailing.service.ts  #   - เซอร์วิสสำหรับส่งอีเมล
│   │   │   ├── templates/          #   - (Optional) โฟลเดอร์สำหรับเก็บ Email Templates
│   │   │       └── welcome.hbs     #     (ตัวอย่าง template)
│   │   │   └── index.ts            #   - (Optional) Export ทุกอย่างจาก mailing/
│   │   │
│   │   └── index.ts                #   - (Optional) ไฟล์หลักสำหรับ re-export โมดูลทั้งหมดจาก core/ เพื่อให้ AppModule สามารถ import โมดูลจาก core/ ได้ง่ายขึ้น เช่น import { ConfigModule, DatabaseModule, LoggerModule } from '#core'; (จะต้องตั้งค่า path alias '#' ใน tsconfig.json ด้วย)
│   │
│   ├── database/                   # Project-Specific DB: Schema, Migrations, Seeds & ORM Config โดยตรง
│   │   ├── data-source.ts          #   - ไฟล์ Config หลักสำหรับ ORM CLI (e.g., TypeORM DataSource)
│   │   │                           #     (จะ config path ไปยัง entities ใน feature modules และ migrations ที่นี่)
│   │   ├── migrations/             #   - โฟลเดอร์สำหรับ Database Migrations (ไฟล์ .ts)
│   │   │   └── .gitkeep            #     (Boilerplate อาจจะว่าง หรือมีตัวอย่าง migration แรก)
│   │   └── seeds/                  #   - โฟลเดอร์สำหรับ Database Seeds (ไฟล์ .ts หรือตาม library ที่ใช้)
│   │       └── .gitkeep            #     (ถ้าใช้ SeedModule อาจจะเก็บแค่ raw data หรือไม่ใช้เลย)
│   │                               #   *Entities: โดยทั่วไปจะอยู่ในแต่ละ Feature Module (e.g., src/modules/users/entities/user.entity.ts)
│   │                               #    และ data-source.ts จะถูกตั้งค่าให้ค้นหา entities จาก path เหล่านั้น (e.g., 'src/modules/**/*.entity.ts')
│   │
│   ├── config/                     # Project-Specific Typed Configurations: โครงสร้าง Config ที่ซับซ้อนของโปรเจกต์นี้
│   │   ├── app.config.ts           #   - (ตัวอย่าง) ใช้ registerAs และ validateAndTransformConfig จาก core
│   │   ├── jwt.config.ts           #   - (ตัวอย่าง)
│   │   ├── database.config.ts      #   - (ตัวอย่าง) Typed config สำหรับ database connection details (ถ้าจำเป็น)
│   │   ├── swagger.config.ts       #   - API documentation config
│   │   └── index.ts                #   - Export array ของ configuration factories ทั้งหมดเพื่อให้ CoreConfigModule โหลด
│   │
│   ├── constants/                  # Project-Specific Global Constants: ค่าคงที่ที่ใช้หลายส่วนใน "โปรเจกต์นี้"
│   │   ├── index.ts
│   │   └── error-codes.constants.ts #  - (ตัวอย่าง)
│   │
│   ├── shared/                     # Boilerplate's Shared Components: Utilities, DTOs พื้นฐาน ที่ใช้ซ้ำได้ทั่วไปใน Boilerplate
│   │   ├── constants/              #   - ค่าคงที่ที่เป็นสากลมากๆ ของ Boilerplate (ควรมีน้อย)
│   │   ├── decorators/             #   - Custom decorators ทั่วไป
│   │   ├── dto/                    #   - Base DTOs (e.g., PaginationDto, SuccessResponseDto)
│   │   ├── exceptions/             #   - Base custom exceptions
│   │   ├── filters/                #   - Global Exception Filters (e.g., GlobalExceptionsFilter)
│   │   ├── guards/                 #   - Global Guards หรือ Guards ที่ใช้ได้ทั่วไปมากๆ (ถ้ามี)
│   │   ├── helpers/                #   - (หรือ utils/) Utility functions ทั่วไป
│   │   ├── interfaces/             #   - TypeScript interfaces ที่ใช้ได้ทั่วไป
│   │   ├── interceptors/           #   - Global Interceptors (e.g., TransformResponseInterceptor)
│   │   ├── pipes/                  #   - Global Pipes (e.g., setup for ValidationPipe)
│   │   └── providers/              #   - Shared utility services (ถ้ามี)
│   │
│   └── modules/                    # (หรือ features/) Feature Modules: ส่วน Business Logic หลักของแอปพลิเคชัน
│       ├── auth/                   #   - (ตัวอย่าง) โมดูลการยืนยันตัวตนและสิทธิ์
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/         #     - Passport strategies
│       │   ├── guards/             #     - Feature-specific guards
│       │   ├── decorators/         #     - Auth-specific decorators
│       │   ├── dto/
│       │   ├── constants/          #     - Auth-specific constants
│       │   └── entities/           #     - (Optional, e.g., RefreshTokenEntity, ถ้า UserEntity อยู่อีก Module)
│       │
│       ├── users/                  #   - (ตัวอย่าง) โมดูลจัดการผู้ใช้งาน
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── dto/
│       │   ├── entities/           #     - User.entity.ts
│       │   ├── repositories/       #     - (Optional) User.repository.ts
│       │   └── constants/
│       │
│       ├── health/                 #   - (Recommended) โมดูลสำหรับ Health Check
│       │   ├── health.module.ts
│       │   └── health.controller.ts
│       │
│       ├── seed/                   #   - (Optional) โมดูลสำหรับจัดการ Database Seeding ที่ซับซ้อนด้วย NestJS Services
│       │   ├── seed.module.ts      #     (เป็นทางเลือก/ส่วนเสริมของ src/database/seeds/)
│       │   ├── seed.service.ts
│       │   └── seeders/            #     - (Optional) โฟลเดอร์เก็บ seeder logic ย่อยๆ
│       │
│       └── [other-feature-module]/ #   - โครงสร้างสำหรับ Feature Module อื่นๆ
│           ├── [feature].module.ts
│           ├── [feature].controller.ts
│           ├── [feature].service.ts
│           ├── dto/
│           ├── entities/
│           ├── constants/
│           └── ...
│
└── test/                           # ไฟล์สำหรับ Unit Tests และ E2E Tests
    ├── jest-e2e.json
    ├── jest.config.js              # (หรือ vitest.config.ts ถ้าใช้ Vitest)
    ├── unit/                       # (Optional) โฟลเดอร์สำหรับ Unit Tests แยกตามโครงสร้าง src
    └── e2e/                        # (Optional) โฟลเดอร์สำหรับ E2E Tests
        └── app.e2e-spec.ts
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

## ධ Running the Application

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

* **Run test coverage:**
    ```bash
    npm run test:cov
    ```

## 🗃️ Database (TypeORM)

This boilerplate uses TypeORM for database interactions.

### Configuration

* The main TypeORM CLI configuration is in `src/database/data-source.ts`. This file is used by TypeORM CLI commands for migrations and other operations. It should be configured to find your entities (typically located within feature modules like `src/modules/**/*.entity.ts`) and migration files.
* The NestJS database connection module is in `src/core/database/database.module.ts`, which uses the configuration provided via the `CoreConfigService` and/or project-specific typed database configurations from `src/config/database.config.ts`.

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
* **Accessing Config:** Use the `CoreConfigService` (from `src/core/config/config.service.ts`) or inject typed configurations directly using `@Inject(config.KEY)`.

## 📄 API Documentation (Swagger)

If Swagger is enabled (typically in `main.ts`), API documentation will be available at `/api` (or your configured path) when the application is running.
Example: `http://localhost:PORT/api`

## 🐳 Docker Support (Optional)

This boilerplate includes a `Dockerfile` and `docker-compose.yml` for containerized development and deployment.

1.  **Build and run with Docker Compose:**
    (Ensure your `.env` file is configured, Docker Compose will use it)
    ```bash
    docker-compose up --build
    ```

2.  **Stop containers:**
    ```bash
    docker-compose down
    ```

## 📜 License

This project is licensed under the [MIT License](LICENSE). ---

*This README provides a comprehensive guide to the boilerplate. Remember to replace placeholders like `[Project Title]`, `your-username/your-repo`, and update specific examples to match your final implementation.*