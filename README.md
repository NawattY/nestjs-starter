# NestJS Clean Modular Monolith — Architecture & Contributor README

> **Purpose:** This README documents the architecture and contributor guidance for the NestJS Starter (“Clean Modular Monolith”) used across projects (SaaS, Automation, POS, AI-backend, etc.).  
> It explains folder structure, conventions, development workflows, and step-by-step guidance for adding features or extracting microservices.

---

## Table of Contents
1. [Principles & Goals](#principles--goals)  
2. [High-level Folder Structure](#high-level-folder-structure)  
3. [Layer Responsibilities](#layer-responsibilities)  
4. [API / DTO / Models / Entities Guidelines](#api--dto--models--entities-guidelines)  
5. [Datasource & Adapters Pattern](#datasource--adapters-pattern)  
6. [Business Layer](#business-layer)  
7. [Core Layer (Infra / Framework)](#core-layer-infra--framework)  
8. [Auth & RBAC Patterns](#auth--rbac-patterns)  
9. [Controller → Service → Model → Output Flow (Examples)](#controller--service--model--output-flow-examples)  
10. [How to Add a New Module (Step-by-step)](#how-to-add-a-new-module-step-by-step)  
11. [How to Prepare Module for Microservice Extraction](#how-to-prepare-module-for-microservice-extraction)  
12. [Naming Conventions & File Rules](#naming-conventions--file-rules)  
13. [Testing Strategy](#testing-strategy)  
14. [Dev / Contribution Workflow](#dev--contribution-workflow)  
15. [Recommended Tooling & Libraries](#recommended-tooling--libraries)  
16. [Mermaid Diagram (Architecture Overview)](#mermaid-diagram-architecture-overview)  
17. [FAQ & Common Pitfalls](#faq--common-pitfalls)  
18. [Appendix: Examples / Templates](#appendix-examples--templates)

## Quick Start

```bash
# 1. Install dependencies
npm install
npm run prepare

# 2. Setup Environment
cp .env.example .env
# (Update .env with your database credentials)

# 3. Database Setup
npm run prisma:migrate
npm run seed

# 4. Run Application
npm run start:dev
```

---

## Principles & Goals

- **Separation of Concerns**: API layer (HTTP) is separated from Application logic and Business rules.  
- **Modularity**: Each feature is a module that contains services, datasources, models and entities.  
- **Testability**: Interfaces and datasources encourage mocking.  
- **Microservice-ready**: Module boundaries are explicit to simplify future extraction.  
- **Pragmatic Clean Architecture**: Not dogmatic DDD — practical and maintainable.

---

## High-level Folder Structure

```
src/
 ├── api/                # HTTP controllers, DTOs, Swagger (transport layer)
 ├── modules/            # Application modules (feature-centric)
 ├── business/           # CrossBusinessModule (Shared rules & policies)
 ├── core/               # Framework & infra (auth, config, prisma, logger)
 ├── shared/             # Utilities, decorators, helpers
 ├── config/             # registerAs config factories
 ├── constants/          # error codes, system-wide constants
 ├── database/           # prisma schema, migrations
 ├── main.ts
 └── app.module.ts
```

---

## Layer Responsibilities

### API Layer (`src/api`)
- Controllers (thin)  
- Request DTOs (class-validator)  
- Response DTOs (class-transformer)  
- Swagger / OpenAPI examples  
- Mapping DTO ↔ Application Model

**Rules**:
- No business logic
- No database calls
- Use only DTOs and mapping to models

### Application Modules (`src/modules`)
- Services (use-case orchestration)  
- Datasources (adapter implementations)  
- Models (`*.input.ts`, `*.output.ts`) — application-level shapes  
- Entities — domain objects used within module

**Rules**:
- Services should accept Models (not DTOs)
- Services should return Entities or Output Models
- Datasources implement datasource interfaces

### Business Layer (`src/business`)
- **CrossBusinessModule**: Shared business rules / policies (cross-module)
- **Dependencies**:
  - ✅ MAY import `PrismaService` (for direct DB access)
  - ❌ MUST NOT import anything from `src/modules` (to avoid circular dependencies)
- **Usage**:
  - Services inject these rules and pass data to them
  - Rules can query DB directly via Prisma if needed

**Rules**:
- Keep business logic here when shared across modules
- Avoid referencing API DTOs or controllers

### Core Layer (`src/core`)
- JWT service, guards, decorators (generic)  
- PrismaService and DB connection management  
- Logger and telemetry adapters  
- Global exception filter, pipes, interceptors  
- File / mailer / third-party adapters

**Rules**:
- Should be stable and generic
- Avoid placing project-specific rules here

---

## API / DTO / Models / Entities Guidelines

- **DTOs** (API Layer)
  - Location: `src/api/<feature>/dtos/requests` & `.../responses`
  - Use class-validator & class-transformer
  - DTOs are *only* used by controllers

- **Models (Application Input / Output)**  
  - Location: `src/modules/<feature>/models`
  - File naming: `create-user.input.ts`, `user-list.output.ts`
  - Purpose: carry data inside services and business logic

- **Entities**
  - Location: `src/modules/<feature>/entities`
  - Represent domain objects (UserEntity, OrderEntity)
  - May be simple classes or interfaces

- **Mapping**
  - Controller maps DTO → Input Model
  - Service returns Output Model / Entity
  - Controller maps Output Model → Response DTO (plainToInstance)

---

## Datasource & Adapters Pattern

- Define `interface <Feature>DataSource` under module datasources.
- Implement adapter `*PrismaDataSource` inside datasources folder.
- Inject datasource via DI using a token constant (e.g., `USER_DATASOURCE`).
- This decouples services from Prisma and allows easy switch to TypeORM or external API.

Example:
```
src/modules/user/datasources/user.datasource.interface.ts
src/modules/user/datasources/user.prisma.datasource.ts
```

---

## Business Layer

- `src/business` stores rules used across modules:
  - product availability checks
  - staff permission checks
  - booking validation rules
- Keep these services small, pure, and testable.

---

## Core Layer (Infra / Framework)

- `src/core/config`: CoreConfigModule, validation schema, environment loading
- `src/core/database`: PrismaService (global), DB lifecycle hooks
- `src/core/auth`: JwtService, JwtAuthGuard, AuthUser decorator (generic)
- `src/core/logger`: logger provider, request logging interceptor
- `src/core/mailer`, `src/core/file`: provider and adapter pattern

---

## Auth & RBAC Patterns

- Core-level auth utilities (token sign/verify) live in `src/core/auth`.
- Project-specific RBAC lives in `src/modules/auth/rbac`.
- Use a small `BaseJwtPayload` in core (minimal fields), and full `JwtPayload` in module.
- Guards in core should only rely on base payload; module guards can cast to full payload.

---

## Controller → Service → Model → Output Flow (Examples)

### Example: Get paginated users

- Controller:
  - Accepts `FindUsersDto` (API DTO)
  - Maps to `FindUsersModel` (application input)
  - Calls `userService.findAll(findUsersModel)`

- Service:
  - Uses datasource: `this.userDs.findMany(...)`
  - Returns `UserListOutput` (meta + items)

- Controller:
  - Maps `UserListOutput` → `UserListResponseDto` and returns

### Output model example
```ts
export class UserListOutput {
  constructor(
    public meta: { totalItems: number; itemsPerPage: number; currentPage: number; totalPages: number; },
    public items: UserEntity[],
  ) {}
}
```

---

## How to Add a New Module (Step-by-step)

1. **Create Module Skeleton**
   ```
   src/modules/<feature>/
       datasources/
       entities/
       models/
       services/
       <feature>.module.ts
   ```
2. **Create API Skeleton**
   ```
   src/api/<feature>/
       controllers/
       dtos/
       swagger/
   ```
3. **Define Datasource Interface** then implement Prisma adapter.
4. **Write Services** — accept Input Models and return Output Models/Entities.
5. **Add Business Rules** to `src/business` if they are reused.
6. **Add Swagger examples and DTOs** under `src/api/<feature>`.
7. **Register module** in `AppModule` composition root (or domain registry).
8. **Write tests**: unit tests for business & services, integration tests for datasources, e2e for API.

---

## How to Prepare Module for Microservice Extraction

- Ensure module has no direct imports from other modules.
- Move project-specific `src/business` logic that the module needs into module-local utilities or publish as shared package.
- Keep datasource adapters local to the module.
- Replace App-level config usage with environment-driven config in the microservice.
- Decide DB strategy (shared DB or DB per service).
- Add event emitters for domain events (UserCreated, OrderPlaced).

---

## Naming Conventions & File Rules

- Modules: `src/modules/<feature>/`
- API: `src/api/<feature>/controllers/<name>.controller.ts`
- DTO request: `<action>.request.dto.ts` or `<action>.dto.ts`
- DTO response: `<resource>.response.dto.ts`
- Input Models: `<action>.input.ts`
- Output Models: `<resource>.output.ts`
- Entities: `<resource>.entity.ts`
- Datasource interface: `<feature>.datasource.interface.ts`
- Datasource implementation: `<feature>.prisma.datasource.ts`
- Constants: `UPPER_SNAKE_CASE` in `src/constants`
- Tokens for DI: `export const USER_DATASOURCE = 'UserDataSource';`

---

## Testing Strategy

- **Unit**: business rules and pure service logic (no DB).
- **Service Tests**: mock datasources with jasmine/ts-mockito or jest mocks.
- **Datasource Tests**: run integration tests connecting to a test database (Docker).
- **API e2e**: supertest + in-memory DB or ephemeral test DB.

---

## Dev / Contribution Workflow

- Branch from `main` using `feature/<ticket>-short-desc`
- Lint with `npm run lint`
- Run unit tests: `npm run test`
- Run e2e tests: `npm run test:e2e`
- PR template: add architecture impact section if changing module boundaries
- Keep PR small and focused on single module or purpose

---

## Recommended Tooling & Libraries

- NestJS (latest stable)  
- Prisma (client + schema)  
- PostgreSQL  
- class-validator / class-transformer  
- Swagger (`@nestjs/swagger`)  
- Jest for testing  
- Docker for local dev & CI  
- Pino or Winston for logging  
- pnpm / npm workspaces for monorepo sharing

---

## Mermaid Diagram (Architecture Overview)

```mermaid
flowchart TB
  subgraph API Layer
    A[Controllers / DTOs]
  end
  subgraph Application
    B[Modules (services, models, datasources)]
  end
  subgraph Business
    C[Shared Business Rules]
  end
  subgraph Core
    D[PrismaService / Auth / Logger / Config]
  end

  A --> B
  B --> C
  B --> D
  C --> D
```

---

## FAQ & Common Pitfalls

**Q: Can services accept DTOs?**  
A: Avoid it. Use Input Models for application-level types. DTOs belong to API layer.

**Q: Where to put shared validation rule?**  
A: `src/business` if used across modules; otherwise module-local.

**Q: Where to put README & docs?**  
A: Root `README.md` (architecture) and module README in `src/modules/<feature>/README.md` for module-specific notes.

**Q: Should core contain auth-rules?**  
A: Core contains generic JWT utilities. Project-specific RBAC belongs to `src/modules/auth/rbac`.

---

## Appendix: Examples & Templates

(Templates included in repository under `/docs/templates` — create if missing)
- Module skeleton
- Datasource interface template
- Output model examples
- Controller → Service mapping snippets

---

## Contact / Ownership
- Maintainers: `kiddeestudio` (primary)  
- Architect: Boss (project owner)  
- For contribution questions, open PRs or contact via project issue.

---