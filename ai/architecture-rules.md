# NestJS Starter — Architecture Rules For AI

> **PURPOSE:** This document defines architecture patterns for NestJS backend applications.  
> **AUDIENCE:** AI agents designing, generating, or reviewing NestJS code.  
> **ENFORCEMENT:** Any code violating "Hard Boundaries" or "Forbidden" rules is a critical failure.

---

## 1) System Architecture

```mermaid
flowchart TD
    Request --> API["API Layer<br/>(Controllers)"]
    API --> App["Application Layer<br/>(Services)"]
    App --> Domain["Domain Layer<br/>(Entities, Value Objects)"]
    App --> Infra["Infrastructure Layer<br/>(Datasources)"]
    Infra -.->|Implements| DB[(Database)]
    App -.->|Cross-Module| App
```

**Hard Boundaries:**
- **API Layer**: Entry point only. NO business logic. NO database access. MUST use Centralized Routes.
- **Application Layer**: Use-cases for domain. MAY import Services from other Modules (use `forwardRef` if circular).
- **Domain Layer**: Entities, Value Objects, Enums. NO external dependencies.
- **Infrastructure Layer**: Database operations. MUST use Interface-based DI.

---

## 2) Folder Structure

**Rule for AI:** When creating a new module, generate **all 4 layers** in one module folder.

```text
src/
├── main.ts
├── app.module.ts
│
├── routes/                           # 📍 Centralized Route Definitions
│   └── app-routes.constant.ts        # Single Source of Truth (V1, V2...)
│
├── modules/                          # 🎯 Domain Modules (Independent Silos)
│   └── {module}/
│       ├── api/                      # Presentation Layer
│       │   ├── controllers/
│       │   │   └── {module}.controller.ts
│       │   ├── dtos/
│       │   │   ├── requests/
│       │   │   └── responses/
│       │
│       ├── application/              # Application Layer (Module Logic)
│       │   ├── {module}.service.ts
│       │   └── models/
│       │       ├── inputs/
│       │       └── outputs/
│       │
│       ├── domain/                   # Domain Layer (Pure Rules)
│       │   ├── entities/
│       │   ├── value-objects/
│       │   └── enums/
│       │
│       ├── infrastructure/           # Infrastructure Layer (Data Access)
│       │   └── datasources/
│       │       ├── {module}.datasource.interface.ts
│       │       └── {module}.prisma.datasource.ts
│       │
│       ├── exceptions/
│       │   └── {module}.exception.ts
│       │
│       └── {module}.module.ts
│
├── core/                             # ⚙️ Core Infrastructure
│   ├── api-docs/                     # Scalar / OpenAPI serving only
│   ├── auth/
│   ├── cache/
│   ├── config/
│   ├── database/
│   ├── event/
│   ├── exceptions/
│   ├── file-upload/
│   ├── interceptors/
│   ├── logger/
│   ├── mailer/
│   ├── pipes/
│   └── redis/
│
├── openapi/                          # 📘 API Contract Source of Truth
│   └── openapi.yaml
│
├── shared/                           # 🔧 Shared Utilities
│   ├── decorators/
│   ├── dto/
│   ├── models/
│   ├── enums/
│   ├── exceptions/
│   ├── helpers/
│   ├── interfaces/
│   └── validators/
│
└── constants/
    ├── error-code.constant.ts
    └── error-message.constant.ts
```

---

## 3) Polyrepo vs Monorepo

**Current repo note:** repository นี้เป็น single-package NestJS app ไม่ได้ใช้ monorepo package import pattern ในปัจจุบัน

| Type | Database Location | Import Pattern |
|------|-------------------|----------------|
| **Polyrepo** | `src/database/prisma/` | `import { PrismaClient } from '@prisma/client'` |
| **Monorepo** | `packages/database/prisma/` | `import { PrismaClient } from '@repo/database'` |

### TypeScript Path Resolution
```json
{
  "rootDir": "./src",
  "outDir": "./dist"
}
```

**Monorepo เพิ่มเติม:** ใช้ package import จริง เช่น `@repo/database`, `@repo/shared`

---

## 4) Layer Rules & Responsibility

### 4.1 API Layer (`modules/{module}/api/`)
- **Responsibility:** Controllers and DTO Validation.
- **Forbidden:** Logic implementation, DB access.
- **Forbidden Imports:** Domain layer, Infrastructure layer, and other feature modules.
- **Route Rule:** MUST use constants from `src/routes/app-routes.constant.ts`.
- **Contract Rule:** MUST NOT become the canonical API documentation source in OpenAPI-first projects.

### 4.2 Application Layer (`modules/{module}/application/`)
- **Responsibility:** Module use-cases + orchestrating cross-module logic.
- **Cross-Module:** MAY import Services from other Modules.
- **Circular Dependency:** Use `forwardRef()` if circular import occurs.
- **Injection:** MUST use `@Inject(TOKEN)` with Interface for Datasources.
- **Forbidden:**
  - ❌ Importing API layer classes.
  - ❌ Service classes importing `PrismaService` as their primary data access mechanism.
  - ❌ Using DTOs (use Input Models).
  - ❌ Returning Entities (use Output Models).

**Exception for application rules:** DB-backed validation rules under `application/rules/` MAY inject `PrismaService` only to call `ensureConnection()` when they also rely on transaction-aware DB access.

```typescript
// ✅ CORRECT - Import Service from other Module
constructor(
  @Inject(ORDER_DATASOURCE) 
  private readonly orderDatasource: OrderDatasource,
  private readonly productService: ProductService, // ✅ Cross-module
) {}

// ✅ CORRECT - forwardRef if circular
imports: [forwardRef(() => ProductModule)]
```

### 4.3 Domain Layer (`modules/{module}/domain/`)
- **Responsibility:** Pure Business Logic (Entities, Value Objects).
- **Forbidden:** External dependencies, database access, framework code, and `src/core` / `src/config` / `src/database` imports.

### 4.4 Infrastructure Layer (`modules/{module}/infrastructure/`)
- **Responsibility:** Database operations.
- **Transaction Rule:** DB queries MUST runผ่าน `TransactionHost<TransactionalAdapterPrisma>` เพื่อรองรับ `nestjs-cls`.
- **Connection Rule:** MAY inject `PrismaService` only to call `ensureConnection()` before DB access. MUST NOT use `PrismaService` as the primary query client inside datasources.
- **Pattern:** Interface + Implementation (Dependency Inversion).
- **Required:** `transformEntity()` method.

```typescript
// {module}.datasource.interface.ts
export const USER_DATASOURCE = Symbol('USER_DATASOURCE');
export interface UserDatasource {
  findById(id: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
}

// {module}.prisma.datasource.ts
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class UserPrismaDatasource implements UserDatasource {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly prismaService: PrismaService,
  ) {}

  private async ensureDatabaseConnection(): Promise<void> {
    await this.prismaService.ensureConnection();
  }
  
  async findById(id: string): Promise<UserEntity | null> {
    await this.ensureDatabaseConnection();
    const user = await this.txHost.tx.user.findUnique({ where: { id } });
    return user ? this.transformEntity(user) : null;
  }
  
  private transformEntity(prisma: User): UserEntity {
    return new UserEntity({ id: prisma.id, email: prisma.email });
  }
}
```

---

## 5) Transaction Management (Unit of Work)

**Mechanism:** Use `nestjs-cls` with `@Transactional()` decorator when a service orchestrates multiple DB writes or cross-module work in one unit.

### 5.1 Cross-Module Transaction

**Note:** ตัวอย่างด้านล่างเป็น pattern เชิงสถาปัตยกรรม ไม่ใช่ module ที่มีอยู่จริงใน repo ปัจจุบัน

```typescript
// modules/order/application/order.service.ts
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_DATASOURCE) private orderDatasource: OrderDatasource,
    private readonly productService: ProductService, // Cross-module
  ) {}

  @Transactional() // ✅ Transaction in Service
  async create(input: CreateOrderInput) {
    // 1. Validate product availability
    const validation = await this.productService.validateForOrder(input.items);
    if (!validation.valid) throw OrderException.productValidationFailed();

    // 2. Create order
    const order = await this.orderDatasource.create(input);

    // 3. Deduct stock (if fails → rollback order)
    await this.productService.deductStock(input.items);

    return order;
  }
}
```

### 5.2 When to Use Transactions

| Scenario | Use Transaction? | Location |
|----------|-----------------|----------|
| Single module CRUD | ❌ No | Service |
| Cross-module operation | ✅ Yes | Service (caller) |
| Async side effects | ❌ No | Event Emitter |

---

## 6) Route Management (Strict Centralization)

**Objective:** Enable easy searching/debugging and maintain strict version control.
**Location:** `src/routes/app-routes.constant.ts`

```typescript
const PREFIX = { V1: 'v1' };

export const ROUTES = {
  V1: {
    AUTH: {
      ROOT: `${PREFIX.V1}/auth`,
      LOGIN: 'login',
      REFRESH: 'refresh',
      LOGOUT: 'logout',
      ME: 'me',
    },
    USER: {
      ROOT: `${PREFIX.V1}/users`,
      ME: 'me',
    },
  },
} as const;
```

### Controller Usage

**Rule:** NEVER hardcode path strings in Controllers. Always import from `ROUTES`.

```typescript
import { ROUTES } from '../../routes/app-routes.constant';

@Controller(ROUTES.V1.USER.ROOT)
export class UserController {
  
  @Get() 
  findAll() {}

  @Get(ROUTES.V1.USER.ME)
  findMe() {}
}
```

**Versioning Note:** current repo ใช้ route constants และมี V1 เป็น baseline เท่านั้น ถ้าจะเพิ่ม V2 ค่อยเพิ่ม constants และ controller ใหม่เมื่อมี requirement จริง

---

## 7) Data Transformation

| Type | Location | Purpose |
|------|----------|---------|
| **DTO** | `api/dtos/` | HTTP Contract (class-validator) |
| **Input Model** | `application/models/inputs/` | Service input |
| **Output Model** | `application/models/outputs/` | Service output |
| **Entity** | `domain/entities/` | Rich domain object |
| **Value Object** | `domain/value-objects/` | Immutable domain value |

**Flow:**
```
HTTP Request → DTO → Input Model → Entity → Output Model → Response DTO
```

**Strict Rules:**
- Services NEVER see DTOs
- Controllers NEVER see Entities

---

## 8) File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Controller | `{module}.controller.ts` | `user.controller.ts` |
| Service | `{module}.service.ts` | `auth.service.ts` |
| Request DTO | `{action}-request.dto.ts` | `login-request.dto.ts` |
| Response DTO | `{name}-response.dto.ts` | `auth-response.dto.ts` |
| Input Model | `{action}.input.ts` | `login.input.ts` |
| Output Model | `{name}.output.ts` | `user.output.ts` |
| Entity | `{module}.entity.ts` | `user.entity.ts` |
| Value Object | `{name}.vo.ts` | `isbn.vo.ts` |
| Datasource Interface | `{module}.datasource.interface.ts` | `user.datasource.interface.ts` |
| Datasource Impl | `{module}.prisma.datasource.ts` | `user.prisma.datasource.ts` |
| Exception | `{module}.exception.ts` | `user.exception.ts` |
| Enum | `{name}.enum.ts` | `common-status.enum.ts` |

---

## 9) Cross-Module Communication

**Rule:** Services MAY import other Services directly. Use `forwardRef()` if circular.

### Scenario A: Validation + Action (e.g., Order needs to check and deduct Product stock)

**Note:** ตัวอย่าง cross-module ด้านล่างใช้ชื่อ module สมมติ เพื่ออธิบาย dependency pattern เท่านั้น

```typescript
// OrderService imports ProductService
@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_DATASOURCE) private datasource: OrderDatasource,
    private readonly productService: ProductService, // ✅ Direct import
  ) {}

  @Transactional()
  async create(input: CreateOrderInput) {
    // Use ProductService methods directly
    const validation = await this.productService.validateForOrder(input.items);
    if (!validation.valid) throw OrderException.productValidationFailed();
    
    const order = await this.datasource.create(input);
    await this.productService.deductStock(input.items);
    
    return order;
  }
}
```

### Scenario B: Circular Dependency (e.g., Order ↔ Product)

```typescript
// order.module.ts
@Module({
  imports: [forwardRef(() => ProductModule)], // ✅ Break circular
  // ...
})

// order.service.ts
constructor(
  @Inject(forwardRef(() => ProductService))
  private readonly productService: ProductService,
) {}
```

### Scenario C: Async Side Effects

- **Pattern:** Event Emitter (non-blocking)
- **Naming:** `domain.entity.action` (past tense)
- Examples: `order.created`, `user.password.changed`

---

## 10) Error Handling

### Error Code & Message Constants
```typescript
// constants/error-code.constant.ts
export const ERROR_CODE = {
  // Global
  VALIDATE_ERROR: 100400,
  NOT_FOUND: 100404,
  INTERNAL_SERVER_ERROR: 100500,
  
  // Auth
  UNAUTHORIZED: 101401,
  INVALID_TOKEN: 101403,
  
  // User (module prefix: 102)
  USER_NOT_FOUND: 102404,
  USER_ALREADY_EXISTS: 102409,
} as const;

// constants/error-message.constant.ts
import { ERROR_CODE } from './error-code.constant';

export const ERROR_MESSAGE: Record<number, string> = {
  [ERROR_CODE.VALIDATE_ERROR]: 'Validation failed',
  [ERROR_CODE.NOT_FOUND]: 'Resource not found',
  [ERROR_CODE.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODE.USER_ALREADY_EXISTS]: 'User already exists',
};
```

### Base Exception Class
```typescript
// shared/exceptions/app.exception.ts
import { ERROR_MESSAGE } from '../../constants/error-message.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

interface AppExceptionOptions {
  errorCode: number;
  statusCode: HttpStatus;
  errors?: string[] | Record<string, string[]>;
}

export class AppException extends HttpException {
  public readonly errorCode: number;
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]> | string[];

  constructor(options: AppExceptionOptions) {
    const { errorCode, statusCode, errors } = options;

    super(
      {
        errorCode,
        errorMessage: ERROR_MESSAGE[errorCode] ?? 'Unknown error',
        errors,
      },
      statusCode,
    );

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
```

### Module-Specific Exception Factory
```typescript
// modules/collection/exceptions/collection.exception.ts
import { ERROR_CODE } from '../../constants/error-code.constant';
import { AppException } from '../../shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class CollectionException {
  static notFound(): never {
    throw new AppException({
      errorCode: ERROR_CODE.COLLECTION_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  static alreadyExists(field: string): never {
    throw new AppException({
      errorCode: ERROR_CODE.COLLECTION_ALREADY_EXISTS,
      statusCode: HttpStatus.CONFLICT,
      errors: [`${field} already exists`],
    });
  }
}
```

### Usage in Service
```typescript
// ✅ CORRECT - Void function, throws directly
async findById(id: string): Promise<CollectionOutput> {
  const entity = await this.datasource.findById(id);
  if (!entity) {
    CollectionException.notFound(); // throws, never returns
  }
  return CollectionOutput.fromEntity(entity);
}
```

### Exception Filter (Global)
```typescript
// core/exceptions/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handles AppException and formats response consistently
    // See src/core/exceptions/http-exception.filter.ts for the current implementation pattern
  }
}
```

**Rules:**
- **Define:** Error codes in `constants/error-code.constant.ts`
- **Throw:** Use module-specific exception factories with `: never` return type
- **Forbidden:** Generic `Error` or `HttpException` in services

---

## 11) Enum Strategy

**Philosophy:** Avoid Prisma enums. Use String columns with TypeScript enums.

```prisma
// ✅ CORRECT
model User {
  status String @default("active") @db.VarChar(20)
}
```

```typescript
export enum CommonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type CommonStatusType = `${CommonStatus}`;
```

**Location:**
- **Shared Enums:** `src/shared/enums/`
- **Module Enums:** `modules/{module}/domain/enums/`

---

## 12) Pagination

**Strict Rule:** Use shared models only (`PaginateQueryDto`, `PaginateInput`, `PaginatedOutput<T>`).

| Layer | Class | Location |
|-------|-------|----------|
| **API** | `PaginateQueryDto` | `src/shared/dto/paginate-query.dto.ts` |
| **API Response** | `PaginateResponseDto<T>` | `src/shared/dto/paginate-response.dto.ts` |
| **Application** | `PaginateInput` | `src/shared/models/paginate.input.ts` |
| **Application** | `PaginatedOutput<T>` | `src/shared/models/paginate.output.ts` |

```typescript
// Datasource usage
return prismaPaginate(this.txHost.tx.collection, {
  where: { userId: input.userId },
  orderBy: { createdAt: 'desc' },
}, input, this.transformEntity);
```

---

## 13) Auth & JWT

### Base Payload
```typescript
// core/auth/jwt-base-payload.interface.ts
export interface JwtBasePayload {
  uid: string;  // User ID (mandatory)
  sid: string;  // Session ID (mandatory)
}
```

### Extended Payload
```typescript
// core/auth/jwt-payload.interface.ts
export interface JwtPayload extends JwtBasePayload {
  role?: string;
  permissions?: string[];
}
```

### Rules
- **Mandatory Fields:** `uid` (User ID), `sid` (Session ID)
- **Extension:** MAY extend JwtBasePayload for additional claims
- **Prohibition:** MUST NOT modify Base Payload shape

### Current User Decorator
```typescript
// shared/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

// Usage
@Get(ROUTES.V1.AUTH.ME)
getProfile(@CurrentUser() user: JwtPayload) {}
```

---

## 14) OpenAPI Contract

### Source of Truth

- The single source of truth for API contracts is `openapi/openapi.yaml`.
- Current repo renders human docs with Scalar from the OpenAPI document.
- Other renderers are acceptable only if they still consume the OpenAPI document instead of becoming a second source of truth.
- Bruno, if used, MUST import or sync from the OpenAPI document.
- AI agents MUST update the OpenAPI document directly when API behavior changes.

### Default Structure

```text
openapi/
└── openapi.yaml
```

**Default Rule:** Keep the contract in a single file unless the spec becomes large enough that human maintenance suffers.

### Optional Multi-File Structure

If the API grows significantly, the contract MAY be split by concern using `$ref`.

```text
openapi/
├── openapi.yaml
├── paths/
│   ├── auth/
│   └── users/
└── components/
    ├── schemas/
    ├── responses/
    ├── parameters/
    └── security/
```

**Use Multi-File Only When:**
- Merge conflicts on the contract become frequent.
- The single-file spec becomes difficult for humans to review.
- Shared schemas/responses become large enough to justify extraction.

### Rules

- **Required:** Every public endpoint MUST be documented in `openapi/openapi.yaml`.
- **Required:** Every operation MUST define `operationId`, `summary`, request schema, response schema, and security requirements when applicable.
- **Required:** Validation and business error responses SHOULD be documented with concrete examples.
- **Forbidden:** Maintaining API contracts in parallel Swagger helper files, response arrays, or other duplicate documentation sources.
- **Forbidden:** Treating Bruno collections as the canonical contract.

### Controller Role

Controllers remain responsible for runtime behavior only.

- MUST NOT be treated as the authoritative API contract.
- MUST NOT require separate `modules/{module}/api/swagger/*.response.ts` files when the project follows OpenAPI-first.
- SHOULD keep request/response serialization aligned with the OpenAPI document instead of relying on runtime decorators as the contract source.

### Consumer Flow

```text
openapi/openapi.yaml
├── Scalar UI (human docs)
└── Bruno import/sync (API client workflow)
```

### Benefits

- ✅ Single source of truth for AI and humans
- ✅ Lower risk of drift between code annotations and published docs
- ✅ Easier API review in pull requests
- ✅ Clear contract handoff to Scalar UI and Bruno

---

## 15) Module Registration

### Module DI Pattern
```typescript
@Module({
  controllers: [CollectionController],
  providers: [
    CollectionService,
    { provide: COLLECTION_DATASOURCE, useClass: CollectionPrismaDatasource },
  ],
  exports: [CollectionService, COLLECTION_DATASOURCE],
})
export class CollectionModule {}
```

### App Module Registration Order
1. **ConfigModule** — Always first (isGlobal: true)
2. **ClsModule** — For transaction management (`ClsPluginTransactional` + `TransactionalAdapterPrisma`)
3. **Core Modules** — Config-adjacent infrastructure such as database, auth, logger, cache, redis, event, docs
4. **Feature Modules** — Current repo uses `AuthModule` and `UserModule`

**Ordering rule:** keep the composition root readable and grouped by concern; do not optimize for alphabetical order over clarity.

**Note:** Use the existing `src/app.module.ts` as the composition reference for this repo.

---

## 16) Testing Strategy

### Test Types & Locations

| Type | Location | Pattern | Purpose |
|------|----------|---------|---------|
| **Unit** | `test/unit/**` | `*.spec.ts` | Service, DTO, config, and utility logic |
| **E2E** | `test/*.e2e-spec.ts` | `{module}.e2e-spec.ts` | HTTP behavior and controller wiring |
| **Source-level Spec** | `src/**/*.spec.ts` | `*.spec.ts` | Small source-adjacent specs that still use the main Jest config |
| **Architecture** | `npm run test:arch` | dependency-cruiser | Dependency boundary validation |

### AAA Pattern (Unit Tests)
```typescript
it('should create', async () => {
  // Arrange
  const input = { title: 'Test' };
  jest.spyOn(datasource, 'create').mockResolvedValue(mockEntity);
  // Act
  const result = await service.create(input);
  // Assert
  expect(result.id).toBe('1');
});
```

**Note:** Use the existing tests under `test/unit` and `test/*.e2e-spec.ts` as the reference patterns for this repo.

---

## 17) AI Coding Checklist

Before generating code:

- [ ] **4 Layers:** Created api, application, domain, infrastructure folders?
- [ ] **Controllers folder:** Controller is in `api/controllers/`?
- [ ] **Routes:** Defined in `app-routes.constant.ts`? No hardcoded strings?
- [ ] **Infra:** Using `TransactionHost` for queries and `PrismaService.ensureConnection()` when DB-backed?
- [ ] **Injection:** Using `@Inject(TOKEN)` with Interface for Datasources?
- [ ] **Cross-Module:** Using `forwardRef()` if circular dependency?
- [ ] **Transaction:** `@Transactional()` in Service (caller) for cross-module?
- [ ] **Types:** Passing DTOs to Service? → Use Input Model
- [ ] **Return:** Returning Prisma object? → Map to Output Model
- [ ] **OpenAPI:** Updated `openapi/openapi.yaml` for contract changes?
- [ ] **Import Paths:** Using relative imports consistently and avoiding unnecessary alias layers?

---

## 18) Coding Standards

**Reference:** See `coding-standards.md` for detailed style guide.

**Quick Rules:**
- Prefer `const`, use `readonly` in models
- Functions: RO-RO pattern (Receive Object, Return Object)
- Control Flow: Early returns, avoid nesting
- Testing: AAA pattern (Arrange-Act-Assert)

---

*End of Architecture Rules (Merged v1 + v3)*
