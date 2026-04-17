# CODING STANDARDS & STYLE GUIDE

> **PURPOSE:** Ensure code readability, maintainability, and consistency across the project.

---

## 1) IMMUTABILITY & VARIABLES

- **Prefer `const`:** Use `let` only when reassignment is strictly necessary.
- **Readonly Models:** All properties in DTOs, Input Models, and Output Models MUST be `readonly`.
- **No Magic Numbers:** Define constants for all numbers/strings used in logic.

```ts
// ✅ CORRECT
export class CreateUserDto {
  readonly email: string;
  readonly age: number;
}

// ❌ WRONG
export class CreateUserDto {
  email: string;
  age: number;
}
```

---

## 2) FUNCTION STRUCTURE (RO-RO PATTERN)

- **Receive Object:** If a function takes more than 2 arguments, strictly use a dedicated Input Model / Object.
- **Return Object:** Always return a typed object or specific Output Model.

```ts
// ✅ CORRECT
async createUser(input: CreateUserInput): Promise<UserOutput> { ... }

// ❌ WRONG
async createUser(email: string, age: number, name: string): Promise<UserOutput> { ... }
```

---

## 3) CONTROL FLOW (EARLY RETURNS)

- **Avoid Nesting:** Use "Guard Clauses" to handle errors or edge cases early.
- **Happy Path Last:** The main logic should be at the lowest indentation level at the end of the function.

```ts
// ✅ CORRECT
if (!user) throw UserException.notFound();
if (user.isActive) throw UserException.alreadyActive();

// ... process logic ...
return result;

// ❌ WRONG
if (user) {
  if (!user.isActive) {
     // ... process logic ...
     return result;
  } else {
     throw UserException.alreadyActive();
  }
} else {
  throw UserException.notFound();
}
```

---

## 4) NAMING CONVENTIONS

- **Booleans:** Must start with a verb (`isActive`, `hasPermission`, `canDelete`).
- **Functions:** Must start with a verb (`create`, `find`, `update`, `calculate`).
- **Variables:** `camelCase`.
- **Classes/Interfaces:** `PascalCase`.

---

## 5) TESTING STANDARDS (AAA PATTERN)

All unit tests MUST follow the **Arrange-Act-Assert** pattern strictly.

```ts
it('should return user balance', async () => {
  // 1. Arrange (Prepare data/mocks)
  const userId = '123';
  const mockUser = { id: userId, balance: 100 };
  jest.spyOn(datasource, 'findById').mockResolvedValue(mockUser);

  // 2. Act (Execute the method)
  const result = await service.getBalance(userId);

  // 3. Assert (Verify results)
  expect(result).toEqual(100);
  expect(datasource.findById).toHaveBeenCalledWith(userId);
});
```

---

## 6) IMPORT ORDERING

Imports must be organized in the following order, separated by blank lines:

1. **External packages** (node_modules)
2. **Internal aliases** (#modules, #core, #shared)
3. **Relative imports** (./, ../)

```typescript
// ✅ CORRECT
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@prisma/client';

import { UserDatasource, USER_DATASOURCE } from '@app/modules/user/infrastructure/datasources';
import { UserException } from '@app/modules/user/exceptions';

import { CreateUserInput } from './models/inputs/create-user.input';
import { UserOutput } from './models/outputs/user.output';

// ❌ WRONG (mixed order, no separation)
import { CreateUserInput } from './models/inputs/create-user.input';
import { Injectable } from '@nestjs/common';
import { UserDatasource } from '@app/modules/user/infrastructure/datasources';
```

### Import Rules
- **No default exports** — Always use named exports
- **No barrel files in modules** — Import directly from source
- **Avoid circular imports** — Use interface tokens for DI

---

## 7) COMMENTS & DOCUMENTATION

### When to Comment
- **Complex business logic** — Explain the "why", not the "what"
- **Workarounds** — Link to issue/ticket
- **Public APIs** — JSDoc for all exported functions

### Comment Patterns
```typescript
// ✅ CORRECT: Explains business rule
// Users with pending status cannot be deleted until 30 days after creation
// See: JIRA-1234
if (user.status === 'pending' && daysSinceCreation < 30) {
  throw UserException.cannotDelete();
}

// ❌ WRONG: States the obvious
// Check if user exists
if (!user) {
  throw UserException.notFound();
}
```

### JSDoc for Public APIs
```typescript
/**
 * Creates a new collection item.
 * 
 * @param input - Collection creation data
 * @returns Created collection with generated ID
 * @throws CollectionException.duplicateTitle - If title already exists
 */
async create(input: CreateCollectionInput): Promise<CollectionOutput> {
  // ...
}
```

### TODO Comments
```typescript
// TODO(username): Implement caching - JIRA-5678
// FIXME: This is a temporary workaround for timezone issue
// HACK: Remove after API v2 migration
```

---

## 8) ASYNC/AWAIT

### Rules
- **Always use async/await** — Avoid `.then()` chains
- **Handle errors with try/catch** — Or let them propagate to global filter
- **Parallel execution** — Use `Promise.all()` when operations are independent

```typescript
// ✅ CORRECT: async/await
async function processOrder(orderId: string) {
  const order = await this.orderDatasource.findById(orderId);
  if (!order) throw OrderException.notFound();
  
  const result = await this.paymentService.process(order);
  return result;
}

// ✅ CORRECT: Parallel execution
async function getUserWithPosts(userId: string) {
  const [user, posts] = await Promise.all([
    this.userDatasource.findById(userId),
    this.postDatasource.findByUserId(userId),
  ]);
  return { user, posts };
}

// ❌ WRONG: .then() chain
function processOrder(orderId: string) {
  return this.orderDatasource.findById(orderId)
    .then(order => {
      if (!order) throw OrderException.notFound();
      return this.paymentService.process(order);
    })
    .then(result => result);
}
```

### Avoid
- ❌ Mixing async/await with .then()
- ❌ Sequential await when parallel is possible
- ❌ Swallowing errors silently

---

## 9) ERROR MESSAGES

### Consistent Format
```typescript
// constants/error-code.constant.ts
export const ERROR_CODE = {
  // Format: MODULE_ACTION_REASON
  USER_CREATE_DUPLICATE_EMAIL: 'USER_CREATE_DUPLICATE_EMAIL',
  USER_UPDATE_NOT_FOUND: 'USER_UPDATE_NOT_FOUND',
  COLLECTION_DELETE_HAS_ITEMS: 'COLLECTION_DELETE_HAS_ITEMS',
} as const;

// constants/error-message.constant.ts
export const ERROR_MESSAGE = {
  USER_CREATE_DUPLICATE_EMAIL: 'Email already exists',
  USER_UPDATE_NOT_FOUND: 'User not found',
  COLLECTION_DELETE_HAS_ITEMS: 'Cannot delete collection with items',
} as const;
```

### Exception Pattern
```typescript
// modules/user/exceptions/user.exception.ts
import { HttpStatus } from '@nestjs/common';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { AppException } from '@app/shared/exceptions/app.exception';

export class UserException {
  static notFound(): never {
    throw new AppException({
      errorCode: ERROR_CODE.USER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  static duplicateEmail(): never {
    throw new AppException({
      errorCode: ERROR_CODE.USER_ALREADY_EXISTS,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}
```

**Rules:**
- Use `: never` return type (function throws, never returns)
- Use `throw` directly, NOT `return new Exception()`
- Use `AppException` for consistent error format

### i18n-Ready Structure
```typescript
// For future i18n support, use placeholders
export const ERROR_MESSAGE = {
  USER_CREATE_DUPLICATE_EMAIL: 'Email {{email}} already exists',
  ORDER_EXCEED_LIMIT: 'Order exceeds limit of {{limit}} items',
} as const;
```

---

## 10) TYPESCRIPT STRICT MODE

### Required tsconfig Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Handling Nullable Values
```typescript
// ✅ CORRECT: Explicit null check
const user = await this.datasource.findById(id);
if (!user) throw UserException.notFound();
// user is now non-null

// ✅ CORRECT: Optional chaining with nullish coalescing
const name = user?.profile?.name ?? 'Anonymous';

// ❌ WRONG: Type assertion without check
const user = await this.datasource.findById(id) as UserEntity;
```

### Avoid Type Assertions
```typescript
// ✅ CORRECT: Type guard
function isUser(obj: unknown): obj is UserEntity {
  return obj !== null && typeof obj === 'object' && 'id' in obj;
}

// ❌ WRONG: Unsafe assertion
const user = data as UserEntity;
```

### Explicit Return Types
```typescript
// ✅ CORRECT: Explicit return type
async findById(id: string): Promise<UserEntity | null> {
  return this.datasource.findById(id);
}

// ❌ WRONG: Implicit return type
async findById(id: string) {
  return this.datasource.findById(id);
}
```

---

*End of Coding Standards*
