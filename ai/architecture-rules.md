# NESTJS CLEAN MODULAR MONOLITH — AI CODING RULES (FINAL, UPDATED)

> This architecture-rules.md defines strict architecture, coding standards, and module boundaries
> that ANY AI (Cursor / Antigravity / ChatGPT) must follow when generating or editing
> code in this repository. The document is intentionally project-agnostic and aligned
> with the starter architecture (Clean Modular Monolith).

---

## 1) SYSTEM ARCHITECTURE — Clean Modular Monolith

The project uses **Clean Modular Monolith** architecture with the following layers:

```
API Layer
→ Module Layer (Domain Application Logic)
→ Business Layer (Cross-domain rules)
→ Datasource Layer (per-module DB adapters)
→ Core Layer (infrastructure)
```

**Hard boundaries**
- **API Layer**: Receives requests, validates via DTOs, calls module services, returns DTOs.
- **Module Layer**: Orchestrates domain logic for one module; interacts with its datasources and business rules only.
- **Business Layer**: Reusable cross-domain rules. May perform read-only lookups via datasources.
- **Datasource Layer**: The only place where Prisma queries are allowed.
- **Core Layer**: Framework/infrastructure (config, logger, auth base, cache, redis, database bootstrap).

**Forbidden**
- API layer contains business logic or direct DB access.
- Cross-module direct calls (module A must not import module B).
- Business layer performs writes or transactions.
- Any circular dependencies.

---

## 2) REPOSITORY FOLDER STRUCTURE (MANDATORY)

All generated files MUST respect this structure:

```
src/
├── api/
│   ├── common/
│   │   └── swagger-helpers.ts
│   └── v1/{module}/
│       ├── controllers/
│       ├── dtos/
│       └── swagger/
│
├── modules/
│   └── {module}/
│       ├── models/
│       ├── services/
│       └── datasources/
│
├── business/
│   ├── rules/
│   ├── validation/
│   └── {domain}/
│
├── core/
│   ├── auth/
│   ├── cache/
│   ├── config/
│   ├── database/
│   ├── exceptions/
│   ├── filters/
│   ├── interceptors/
│   ├── logger/
│   └── redis/
│
├── shared/
├── constants/
├── config/
└── database/
    └── schema.prisma
```

**AI must create files in the exact folder(s) above.**

---

## 3) LAYER RULES (HARD RULES)

### API Layer
- Accepts requests, validates via DTOs, calls module services, returns response DTOs.
- MUST NOT contain business logic, Prisma usage, datasource access, or perform authorization (except via Guards).

### Module Layer
- Implements use-cases for that module only.
- May call module datasources and business rules.
- Should return domain models (not DTOs).
- MUST NOT import other modules or use Prisma directly.

### Business Layer
- Holds reusable rules and cross-domain validations.
- **Dependencies**:
  - ✅ MAY import `PrismaService` (for direct DB access).
  - ✅ MAY import Domain Models (from `src/modules/*/models`).
  - ❌ MUST NOT import Module Services (Circular Dependency Risk).
  - ❌ MUST NOT import Controllers or DTOs.
- **Usage**:
  - Injected into Module Services to perform checks.
  - `Service` -> `BusinessRule` -> `PrismaService` (Safe).
- **Side Effects**:
  - ❌ MUST NOT perform writes or transactions directly (leave that to Service).
  - ❌ MUST NOT trigger side effects (use Events for that).

### Datasource Layer
- Exclusive place for Prisma usage.
- Maps Prisma entities → domain models.
- MUST NOT contain business logic or import services/controllers.

### Core Layer
- Provides global infrastructure: config, auth base, logger, cache abstraction, redis, prisma service, filters, interceptors.
- MUST NOT contain feature-specific business logic.

---

## 4) NAMING RULES

- Files: `kebab-case` (e.g., `user.service.ts`)
- Classes: `PascalCase` (e.g., `UserService`)
- Variables/functions: `camelCase` (e.g., `findUser`)
- DTOs:
  - `*.request.dto.ts`
  - `*.response.dto.ts`
- Models: `*.model.ts`
- Datasource: `*.datasource.ts`
- Database fields: `snake_case` (use `@map()` in Prisma where necessary)

---

## 5) MODELS vs DTO vs ENTITY RULES

### 5.1 Definitions

- **Model (module/models/):** Domain-level shapes used inside services & business rules. Not tied to Prisma types or HTTP.
- **DTO (api/.../dtos/):** Request/response shapes only. Controllers accept/return DTOs; services must not depend on DTOs.
- **Entity (module/entities/):** Domain entities representing core business objects. Used by services and datasources.
- **Prisma Entity:** Database models used only inside datasources. Must be mapped to domain entities/models before returning.

### 5.2 Mandatory Rules

**MUST:**
- ✅ Create dedicated Model classes in `src/modules/{module}/models/` for service method parameters and return types
- ✅ Use `.input.ts` suffix for input models (e.g., `create-user.input.ts`, `update-user.input.ts`)
- ✅ Use `.output.ts` suffix for output models (e.g., `user.output.ts`, `merchant.output.ts`)
- ✅ Services work exclusively with Models and Entities, never with DTOs
- ✅ Controllers transform DTOs ↔ Models using `plainToInstance` or manual mapping
- ✅ Datasources transform Prisma types → Domain Entities

**MUST NOT:**
- ❌ Use inline types in service method signatures (e.g., `data: { email?: string }`)
- ❌ Import or use DTOs in services, business rules, or datasources
- ❌ Return Prisma types directly from datasources
- ❌ Mix concerns (e.g., validation decorators in Models)

### 5.3 Examples

#### ✅ CORRECT: Using Models

```ts
// src/modules/user/models/update-user.input.ts
export class UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}

// src/modules/user/services/user.service.ts
import { UpdateUserInput } from '../models/update-user.input';

export class UserService {
  async updateMe(userId: string, data: UpdateUserInput): Promise<UserEntity> {
    return this.userDatasource.update(userId, data);
  }
}

// src/api/v1/user/controllers/user.controller.ts
import { UpdateUserRequestDto } from '../dtos/requests/update-user-request.dto';
import { UpdateUserInput } from '#modules/user/models/update-user.input';

export class UserController {
  @Patch('me')
  async updateMe(@Body() dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    // Transform DTO → Model
    const input: UpdateUserInput = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };
    
    const user = await this.userService.updateMe(userId, input);
    
    // Transform Entity → DTO
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
```

#### ❌ INCORRECT: Using Inline Types

```ts
// ❌ BAD: Inline type in service
export class UserService {
  async updateMe(
    userId: string, 
    data: { email?: string; firstName?: string; lastName?: string }
  ): Promise<UserEntity> {
    return this.userDatasource.update(userId, data);
  }
}

// ❌ BAD: Using DTO in service
import { UpdateUserRequestDto } from '#api/v1/user/dtos/requests/update-user-request.dto';

export class UserService {
  async updateMe(userId: string, dto: UpdateUserRequestDto): Promise<UserEntity> {
    return this.userDatasource.update(userId, dto);
  }
}
```

### 5.4 Model Naming Conventions

**Input Models:**
- `create-{entity}.input.ts` - For creation operations
- `update-{entity}.input.ts` - For update operations
- `{entity}-query.input.ts` - For query/filter operations
- `{action}-{entity}.input.ts` - For specific actions

**Output Models:**
- `{entity}.output.ts` - Primary output representation
- `{entity}-list.output.ts` - For list responses (if different from single)

**Examples:**
```
src/modules/user/models/
├── create-user.input.ts
├── update-user.input.ts
├── user-query.input.ts
├── user.output.ts
└── user-list.output.ts

src/modules/merchant/models/
├── create-merchant.input.ts
├── update-merchant.input.ts
├── merchant-query.input.ts
└── merchant.output.ts
```

### 5.5 When to Create Models vs Reuse Entities

**Create separate Models when:**
- Input/output shapes differ from entity structure
- Need to exclude/include specific fields
- Require computed or transformed fields
- Different use cases need different representations

**Reuse Entities when:**
- Service returns complete entity without transformation
- No need for field filtering or computation
- Entity structure matches business requirements exactly

### 5.6 Service Method Naming

**Principle:** Service methods should be generic and not tied to API-specific concepts.

**DO:**
```ts
// ✅ Generic method names
export class UserService {
  async getById(userId: string): Promise<UserOutput> { ... }
  async update(userId: string, data: UpdateUserInput): Promise<UserOutput> { ... }
  async delete(userId: string): Promise<void> { ... }
}
```

**DO NOT:**
```ts
// ❌ API-specific names in service
export class UserService {
  async getMe(userId: string): Promise<UserOutput> { ... }      // ❌ "me" is API concept
  async updateMe(userId: string, data: UpdateUserInput) { ... } // ❌ "me" is API concept
  async deleteMyAccount(userId: string) { ... }                 // ❌ "my" is API concept
}
```

**Rationale:** 
- "me", "my", "current" are API/Controller concepts that depend on authentication context
- Services are domain logic and should work with any entity ID
- Controllers handle the "me" → actual userId mapping: `userService.getById(currentUser.uid)`

**Example:**
```ts
// Controller (API layer) - knows about "me" concept
@Get('me')
async getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
  const userOutput = await this.userService.getById(user.uid); // ✅ Pass actual userId
  return plainToInstance(UserResponseDto, userOutput);
}

// Service (Domain layer) - generic, reusable
async getById(userId: string): Promise<UserOutput> {
  const user = await this.userDatasource.findById(userId);
  if (!user) return null;
  return plainToInstance(UserOutput, user);
}
```

### 5.7 Service Return Types (CRITICAL)

**MUST:**
- ✅ Services MUST return Output models, not Entities
- ✅ Even if Entity has no sensitive fields, still use Output for consistency
- ✅ Transform Entity → Output in service layer using `plainToInstance`
- ✅ Use `excludeExtraneousValues: true` with `@Expose()` decorators

**MUST NOT:**
- ❌ Services must NOT return Entity directly (even if technically safe)
- ❌ Services must NOT return Prisma types directly
- ❌ Services must NOT mix return types (some Output, some Entity)

**Rationale:**

1. **Consistency:** All services follow same pattern - easier to understand and maintain
2. **Security by Default:** Explicit boundary prevents accidental sensitive data leaks (e.g., password)
3. **Future-Proof:** Entity changes (adding password field) don't break service contract
4. **Clear Separation:** 
   - Entity = internal database representation
   - Output = external business representation

**Example:**

```ts
// ✅ CORRECT: Always use Output
import { plainToInstance } from 'class-transformer';
import { UserOutput } from '../models/user.output';

export class UserService {
  async getById(userId: string): Promise<UserOutput | null> {
    const user = await this.userDatasource.findById(userId);
    if (!user) return null;
    
    // Transform Entity → Output (filters out password, internal fields)
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,  // Only @Expose() fields
    });
  }
  
  async update(userId: string, data: UpdateUserInput): Promise<UserOutput> {
    const user = await this.userDatasource.update(userId, data);
    
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }
}

// UserOutput.ts - Only safe fields
export class UserOutput {
  @Expose() id!: string;
  @Expose() email?: string;
  @Expose() mobile!: string;
  @Expose() fullName!: string;
  @Expose() isActive!: boolean;
  // ✅ No password field!
}
```

```ts
// ❌ WRONG: Return Entity directly
export class UserService {
  async getById(userId: string): Promise<UserEntity | null> {
    return this.userDatasource.findById(userId);  // ❌ May leak password!
  }
}

// ❌ WRONG: Inconsistent return types
export class MerchantService {
  async getById(id: string): Promise<MerchantEntity> { ... }     // ❌ Returns Entity
  async getByOwner(id: string): Promise<MerchantOutput[]> { ... } // ✅ Returns Output
  // Inconsistent! Pick one pattern and stick to it
}
```

**Exception:** 

None. Always use Output models for all service return types. Even if Entity has no sensitive fields today, it might in the future.

**Transformation Layer:**

Service acts as transformation layer:
1. **Input:** Datasource returns Entity (raw from database)
2. **Process:** Business logic
3. **Output:** Transform to Output model (business representation)

```
┌──────────────┐     Entity      ┌──────────┐     Output      ┌────────────┐
│  Datasource  │ ───────────────> │ Service  │ ───────────────> │ Controller │
└──────────────┘  (internal)      └──────────┘  (external)      └────────────┘
```

---

## 6) PAGINATION RULES

### 6.1 Use Base DTOs for Pagination

**MUST:**
- ✅ Query DTOs must extend `PaginateQueryDto` from `#shared/dto/paginate-query.dto`
- ✅ Response DTOs must extend `PaginateResponseDto<T>` from `#shared/dto/paginate-response.dto`
- ✅ Use `DEFAULT_PAGINATION` constants from `#constants/pagination.constant`
- ✅ Use `prismaPaginate` helper from `#shared/helpers/prisma-paginate.helper` in datasources

**MUST NOT:**
- ❌ Create custom pagination fields (page, perPage, meta, links)
- ❌ Duplicate pagination logic
- ❌ Hardcode pagination defaults

### 6.2 Query DTO Pattern

```ts
// src/api/v1/merchant/dtos/requests/merchant-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateQueryDto } from '#shared/dto/paginate-query.dto';

export class MerchantQueryDto extends PaginateQueryDto {
  // Only add module-specific filter fields
  @ApiPropertyOptional({ description: 'Filter by merchant code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @IsString()
  status?: string;
}
```

**Benefits:**
- Inherits `page` and `perPage` with validation and transformation
- Default values from `DEFAULT_PAGINATION` (page=1, perPage=20, max=100)
- Automatic type coercion and bounds checking

### 6.3 Response DTO Pattern

```ts
// src/api/v1/merchant/dtos/responses/merchant-list-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateResponseDto } from '#shared/dto/paginate-response.dto';
import { MerchantResponseDto } from './merchant-response.dto';

export class MerchantListResponseDto extends PaginateResponseDto<MerchantResponseDto> {
  @ApiProperty({ description: 'List of merchants', type: [MerchantResponseDto] })
  @Expose()
  @Type(() => MerchantResponseDto)
  items!: MerchantResponseDto[];
}
```

**Benefits:**
- Inherits `meta` and `links` fields
- Type-safe with generic `<T>`
- Consistent pagination structure across all endpoints

### 6.4 Domain Model Pattern

**MUST:**
- ✅ Input models for list queries MUST extend `PaginateInput` from `#shared/models/paginate.input`
- ✅ Output models for list results MUST extend `PaginatedOutput<T>` from `#shared/models/paginate.output`

**Example:**
```ts
// src/modules/merchant/models/merchant-query.input.ts
import { PaginateInput } from '#shared/models/paginate.input';

export class MerchantQueryInput extends PaginateInput {
  code?: string;
  status?: string;
}

// src/modules/merchant/models/merchant-list.output.ts
import { PaginatedOutput } from '#shared/models/paginate.output';
import { MerchantOutput } from './merchant.output';

export class MerchantListOutput extends PaginatedOutput<MerchantOutput> {
  @Expose()
  @Type(() => MerchantOutput)
  items!: MerchantOutput[];
}
```

### 6.5 Service & Datasource Pattern

```ts
// Service
async getByOwnerPaginated(
  ownerUserId: string,
  query: MerchantQueryInput,
): Promise<MerchantListOutput> {
  const result = await this.merchantDatasource.findAll({
    ...query,
    ownerUserId,
  });

  return plainToInstance(MerchantListOutput, result, {
    excludeExtraneousValues: true,
  });
}

// Datasource
async findAll(query: FindMerchantOptions): Promise<PaginatedResultInterface<MerchantEntity>> {
  const { page = 1, perPage = 20, code, ownerUserId, status } = query;

  return prismaPaginate(this.prisma.merchant, {
    page,
    perPage,
    where: {
      ...(code && { code }),
      ...(ownerUserId && { ownerUserId }),
      ...(status && { status }),
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

### 6.6 Controller Pattern

```ts
@Get('me')
async getMyMerchants(
  @CurrentUser() user: JwtPayload,
  @Query() query: MerchantQueryDto,
): Promise<MerchantListResponseDto> {
  // PaginateQueryDto handles defaults, just pass through
  const result = await this.merchantService.getByOwnerPaginated(user.uid, query);
  return plainToInstance(MerchantListResponseDto, result, {
    excludeExtraneousValues: true,
  });
}
```

---

## 7) PRISMA RULES

- Prisma queries are allowed only in `src/modules/{module}/datasources/*` or in `src/core/database/*`.
- Use provided `PrismaService` from `src/core/database/prisma.service.ts` — NEVER instantiate `PrismaClient` manually.
- Multi-step operations must use `prisma.$transaction()` in the datasource.
- Datasource must perform mapping from database rows to domain models.

---

## 8) ERROR HANDLING RULES

### 7.1 Error Code & Message Management

All error codes and messages MUST be defined in constants:

**Files:**
```
src/constants/error-code.constant.ts
src/constants/error-message.constant.ts
```

**Structure:**
```ts
// error-code.constant.ts
export const ERROR_CODE = {
  // Global errors (100xxx)
  VALIDATE_ERROR: 100422,
  NOT_FOUND: 100404,
  CONFLICT: 100409,
  INTERNAL_SERVER_ERROR: 100500,

  // Auth errors (101xxx)
  UNAUTHORIZED: 101401,
  INVALID_CREDENTIALS: 101402,
  
  // User errors (102xxx)
  USER_NOT_FOUND: 102404,
  
  // Merchant errors (103xxx)
  MERCHANT_NOT_FOUND: 103404,
  MERCHANT_CODE_EXISTS: 103409,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
```

```ts
// error-message.constant.ts
import { ERROR_CODE } from './error-code.constant';

export const ERROR_MESSAGE: Record<number, string> = {
  [ERROR_CODE.VALIDATE_ERROR]: 'Validation failed',
  [ERROR_CODE.NOT_FOUND]: 'Resource not found',
  [ERROR_CODE.MERCHANT_NOT_FOUND]: 'Merchant not found',
  // ... more mappings
};
```

**Error Code Numbering Convention:**
- `100xxx` - Global/Generic errors (validation, not found, conflict, etc.)
- `101xxx` - Authentication/Authorization errors
- `102xxx` - User module errors
- `103xxx` - Merchant module errors
- `104xxx` - Booking module errors
- etc.

**Rules:**
- MUST define error codes in constants before using in services or swagger docs
- MUST provide corresponding error messages
- Use typed errors with `errorCode` and `errorMessage` fields
- Let `http-exception.filter.ts` handle error formatting

### 7.2 Throwing Errors in Services

**Pattern: Use Module-specific Exception Classes**

**Step 1:** Create a module exception class in `src/modules/{module}/exceptions/{module}.exception.ts`

```ts
// src/modules/merchant/exceptions/merchant.exception.ts
import { ERROR_CODE } from '#constants/error-code.constant';
import { AppException } from '#shared/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

export class MerchantException {
  static notFound(merchantId: string): never {
    throw new AppException({
      errorCode: ERROR_CODE.MERCHANT_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      message: `Merchant with id "${merchantId}" not found`,
    });
  }

  static codeExists(code: string): never {
    throw new AppException({
      errorCode: ERROR_CODE.MERCHANT_CODE_EXISTS,
      statusCode: HttpStatus.CONFLICT,
      message: `Merchant with code "${code}" already exists`,
    });
  }
}
```

**Step 2:** Use in services

```ts
// src/modules/merchant/services/merchant.service.ts
import { MerchantException } from '../exceptions/merchant.exception';

export class MerchantService {
  async create(input: CreateMerchantInput): Promise<MerchantEntity> {
    const existing = await this.merchantDatasource.findByCode(input.code);
    if (existing) {
      MerchantException.codeExists(input.code);
    }
    return this.merchantDatasource.create(input);
  }

  async getById(id: string): Promise<MerchantOutput> {
    const merchant = await this.merchantDatasource.findById(id);
    if (!merchant) {
      MerchantException.notFound(id);
    }
    return plainToInstance(MerchantOutput, merchant);
  }
}
```

**Benefits of this pattern:**
- ✅ Centralized error definitions per module
- ✅ Type-safe with never return type
- ✅ Consistent error codes usage
- ✅ Easy to maintain and test
- ✅ Clear separation of concerns

**DO:**
```ts
// ✅ Use module exception class
MerchantException.notFound(id);
AuthException.credentialMismatch();
```

**DO NOT:**
```ts
// ❌ Generic Error
throw new Error('Merchant not found');

// ❌ Direct NestJS exception
throw new NotFoundException('Merchant not found');

// ❌ Direct AppException (use exception class instead)
throw new AppException({
  errorCode: ERROR_CODE.MERCHANT_NOT_FOUND,
  statusCode: HttpStatus.NOT_FOUND,
});
```

### 7.3 Error Response Format

The global exception filter (`src/core/exceptions/http-exception.filter.ts`) formats all errors as:

```json
{
  "status": {
    "code": 404,
    "message": "Not Found"
  },
  "error": {
    "code": 103404,
    "message": "Merchant not found",
    "errors": []
  },
  "path": "/api/v1/merchants/xxx",
  "timestamp": "2025-01-22T01:15:00.000Z"
}
```

---

## 9) SWAGGER DOCUMENTATION RULES

### 9.1 Folder Structure

**MUST** create swagger response files in dedicated swagger folder:

```
src/api/v1/{module}/swagger/
├── {endpoint-name}.response.ts
└── index.ts
```

**Example:**
```
src/api/v1/merchant/swagger/
├── create-merchant.response.ts
├── get-my-merchants.response.ts
├── get-merchant-by-id.response.ts
└── index.ts
```

### 9.2 Response File Format

**Use SwaggerHelpers for cleaner, reusable documentation:**

```ts
// src/api/v1/merchant/swagger/create-merchant.response.ts
import { SwaggerHelpers } from '#api/common/swagger-helpers';
import { ERROR_CODE } from '#constants/error-code.constant';

const merchantExample = {
  id: '770e8400-e29b-41d4-a716-446655440000',
  code: 'my-salon-01',
  title: 'Beautiful Hair Salon',
  timezone: 'Asia/Bangkok',
  ownerUserId: '550e8400-e29b-41d4-a716-446655440000',
  status: 'active',
  createdAt: '2025-01-22T01:15:00.000Z',
  updatedAt: '2025-01-22T01:15:00.000Z',
};

export const createMerchantResponse = [
  SwaggerHelpers.success(201, merchantExample, 'Merchant created successfully'),
  SwaggerHelpers.validationError({
    code: ['code must be lowercase alphanumeric with hyphens only'],
    title: ['title should not be empty'],
  }),
  SwaggerHelpers.unauthorized(),
  SwaggerHelpers.conflict(
    ERROR_CODE.MERCHANT_CODE_EXISTS,
    'Merchant code already exists',
  ),
];
```

**Available SwaggerHelpers methods:**
- `success(status, example, description?)` - Success responses (200, 201)
- `validationError(customErrors?)` - 400 Validation Error
- `unauthorized()` - 401 Unauthorized  
- `forbidden()` - 403 Forbidden
- `notFound(resourceName, customMessage?)` - 404 Not Found
- `conflict(errorCode, message)` - 409 Conflict
- `internalServerError()` - 500 Internal Server Error
- `customError(status, errorCode, message, description)` - Custom errors

### 9.3 Controller Integration

Import and use swagger responses in controllers:

```ts
import { ApiResponses } from '#shared/decorators/api-response.decorator';
import { SwaggerHelpers } from '#api/common/swagger-helpers';
import { createMerchantResponse, getMyMerchantsResponse } from '../swagger';

@ApiTags('Merchant')
@Controller({ path: 'merchants', version: '1' })
export class MerchantController {
  
  @ApiOperation({
    summary: 'Create a new merchant',
    description: 'Create a new merchant with the authenticated user as owner',
  })
  @ApiResponses(createMerchantResponse)
  @Post()
  async create(@Body() dto: CreateMerchantRequestDto) {
    // ...
  }
}
```

### 9.4 Swagger Documentation Checklist

When creating new endpoints, AI MUST:

1. ✅ Create swagger response file in `src/api/v1/{module}/swagger/`
2. ✅ Define success response with realistic example JSON
3. ✅ Define all possible error responses (400, 401, 403, 404, 409, 500)
4. ✅ Ensure error codes match those defined in `src/constants/error-code.constant.ts`
5. ✅ Export response from `swagger/index.ts`
6. ✅ Import and use in controller with `@ApiResponses()`
7. ✅ Add `@ApiOperation()` with summary and description
8. ✅ Add `@ApiTags()` to controller class

**DO NOT:**
- ❌ Define swagger responses inline in controllers
- ❌ Use error codes not defined in constants
- ❌ Forget to document error cases
- ❌ Mix swagger files with controller files

---

## 10) AUTH & JWT RULES (UPDATED — Base + Extension pattern)


### 9.1 Base JWT payload (core)
The minimal, canonical JWT payload is defined in core and **must not be changed**:

File:
```
src/core/auth/jwt-base-payload.interface.ts
```

Shape:
```ts
export interface BaseJwtPayload {
  uid: string;
  sid: string;
  iat?: number;
  exp?: number;
}
```

The fields `uid` and `sid` are mandatory and must remain `string`.

### 9.2 Module-level extended payload (allowed)
Modules (or projects) MAY extend the base payload to add domain-specific claims.

Example extension file location (required):
```
src/modules/auth/rbac/jwt-payload.interface.ts
```

Example:
```ts
import { BaseJwtPayload } from "#core/auth/jwt-base-payload.interface";

export interface JwtMerchantRole {
  merchantId: string;
  roles: string[];
}

export interface JwtPayload extends BaseJwtPayload {
  roles?: string[];         // global roles (optional)
  merchantRoles?: JwtMerchantRole[]; // module-scoped roles (optional)
}
```

**Rules**
- Extended payload MUST `extend BaseJwtPayload`.
- AI may add fields in module-level payloads, but MUST NOT remove or change the types of `uid` or `sid`.
- Guards and core-auth utilities rely only on `BaseJwtPayload` for core auth behavior.

---

## 11) CACHE & REDIS RULES

- Use `CacheService` (global) exposed by `src/core/cache/cache.service.ts` for caching.
- `RedisService` lives in `src/core/redis/` and is **NOT** global; it is an implementation detail.
- `CacheModule` is global and chooses the adapter (Redis or Memory) during bootstrap.
- Module/business code MUST use `CacheService` only; direct use of `RedisService` in modules is forbidden (except inside adapters or core infra code).

---

## 12) API RESPONSE RULES

- **Success:** Controller should return DTO values directly (no wrapper `{ success: true }`).
- **Error:** Throw typed errors; rely on global exception filter that formats error payload consistently.

---

## 13) JWT USAGE & AUTH CHECKS

- Authorization guards must be implemented as decorators/guards in `src/core/auth/` (CoreAuth) or module-level RBAC in `src/modules/auth/rbac/`.
- Controllers MUST apply guards (e.g., `JwtAuthGuard`) and RBAC guards via `@UseGuards()`; do not inline authorization logic in controllers.

---

## 14) CODING PRINCIPLES (MANDATORY)

- Single Responsibility per file.
- No circular dependencies.
- Keep API thin — controllers orchestrate, services implement.
- Datasource is the exclusive persistence boundary.
- Business rules must be isolated in `business/`.
- Maintain strict module isolation and DI-friendly providers.

---

## 15) AI DEVELOPMENT WORKFLOW (MANDATORY)

When AI generates or edits code, follow this checklist:

1. Determine correct Layer and target folder.
2. Create DTOs in `api/.../dtos` if request/response required.
3. **Create Swagger response files in `api/.../swagger/` with proper error codes.**
4. **Define error codes in `src/constants/error-code.constant.ts` if new errors are needed.**
5. **Create Model classes in `modules/{module}/models/` for service inputs/outputs (NEVER use inline types).**
6. Create/modify domain Entity in `modules/{module}/entities` if needed.
7. Implement use-case logic in `modules/{module}/services/*` using Models (not DTOs).
8. Place DB queries in `modules/{module}/datasources/*` and use `PrismaService`.
9. Add guards/validation in `core/` or `modules/{module}/rbac` as appropriate.
10. Ensure no cross-module imports; if needed, refactor to business rules.
11. Use proper error types with error codes; do not throw generic Error.
12. Run static-type verification; respect naming conventions.
13. Keep changes minimal and add tests where necessary.

---

## 16) EXAMPLES & TIPS FOR AI

- **Where to put `getProducts` API**
  - Controller: `src/api/v1/product/controllers/product.controller.ts`
  - DTOs: `src/api/v1/product/dtos`
  - Swagger: `src/api/v1/product/swagger/`
  - Service: `src/modules/product/services/product.service.ts`
  - Datasource: `src/modules/product/datasources/product.prisma.datasource.ts`
  - Business rule (if cross-domain): `src/business/rules/product.rules.ts`

- **Where to do validation**
  - Input validation: DTO + ValidationPipe in API layer
  - Business validation: `business/` (read-only or rule checks); do not write DB here

- **How to add new error codes**
  1. Add to `src/constants/error-code.constant.ts` with proper numbering
  2. Add message to `src/constants/error-message.constant.ts`
  3. Use in service: `throw new NotFoundException({ errorCode: ERROR_CODE.XXX, errorMessage: ERROR_MESSAGE[ERROR_CODE.XXX] })`
  4. Document in swagger responses

---

## 17) ENFORCEMENT AND LINTING

- AI-generated code must pass project linter and type-checking.
- CI must run layer-sanity checks (no forbidden imports, no cross-module references).
- Introduce automated tests that assert folder-level imports (optional but recommended).

---

## 18) CHANGE MANAGEMENT

- Any change to core interfaces (e.g., `BaseJwtPayload`, `PrismaService` shape) must be reviewed and approved by repository maintainers.
- Module-level payload extensions are allowed without changing core interfaces.

---

## 19) EVENT DRIVEN ARCHITECTURE (SIDE EFFECTS)

### 19.1 Rule
- **Services** must focus on data mutation and business logic.
- **Side Effects** (Email, Notifications, Third-party integrations) MUST be decoupled using Domain Events.
- Use `@nestjs/event-emitter`.

### 19.2 Pattern
1. Define Event in `src/modules/{module}/events/{event-name}.event.ts`.
2. Emit Event in Service after successful operation.
3. Handle Event in `src/modules/{module}/listeners/{event-name}.listener.ts`.

**Example:**
```ts
// Service
this.eventEmitter.emit(
  'user.created',
  new UserCreatedEvent(user.id, user.email)
);
```

---

## 20) ARCHITECTURE TESTING

### 20.1 Rule
- Architecture rules are enforced via `dependency-cruiser`.
- Configuration is in `.dependency-cruiser.js`.
- Run checks with `npm run test:arch`.

### 20.2 Enforced Rules
- **Dependency Rule**: API -> Module -> Datasource.
- **Circular Dependency**: No cycles allowed.
- **Cross-Module**: Modules cannot import each other directly.

---

### END — RULES FOR AI
This file is authoritative for AI-driven code-gen in this repository.
Follow it strictly. Violations must surface as CI failures.

---