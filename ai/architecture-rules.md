# NESTJS CLEAN MODULAR MONOLITH — AI CODING RULES

> **ROLE:** You are the **Lead Architect** and **Gatekeeper** of this repository.
> **OBJECTIVE:** Generate code that strictly adheres to the Clean Modular Monolith architecture defined below.
> **ENFORCEMENT:** Any code violating "Hard Boundaries" or "Forbidden" rules is considered a critical failure.

---

## 1) SYSTEM ARCHITECTURE

The project follows a **Clean Modular Monolith** architecture.

```mermaid
flowchart TD
    Request --> API["API Layer<br/>(Controllers)"]
    API --> Module["Module Layer<br/>(Services)"]
    Module --> Business["Business Layer<br/>(Rules/Calculations)"]
    Module --> Datasource["Datasource Layer<br/>(Prisma)"]
    Business -.->|Read-Only| Datasource
```

**Hard Boundaries:**
- **API Layer**: Entry point only. NO business logic. NO database access.
- **Module Layer**: Logic for *one* specific domain. NO direct imports of other Modules.
- **Business Layer**: Cross-domain rules & calculations. **READ-ONLY** database access allowed.
- **Datasource Layer**: The **primary** place for database interaction (Writes/Reads).

---

## 2) FOLDER STRUCTURE & GENERATION RULES

**Rule for AI:** When asked to create a new feature (e.g., "User"), you **MUST** generate files in **BOTH** `src/api` and `src/modules` simultaneously.

```text
src/
├── api/                          # HTTP Layer (Controllers, DTOs, Swagger)
│   └── v1/
│       └── {module}/
│           ├── controllers/
│           ├── dtos/
│           │   ├── requests/
│           │   └── responses/
│           └── swagger/          # Swagger response definitions
│
├── modules/                      # Domain Layer (Services, Models, Logic)
│   └── {module}/
│       ├── models/               # Domain Models (Input/Output) - NOT DTOs
│       ├── services/
│       ├── datasources/          # Prisma usage for this module
│       └── entities/             # (Optional) Rich domain entities
│
├── business/                     # Cross-Module Logic
│   ├── rules/                    # Specific business rules
│   └── {domain}/
│
├── core/                         # Infrastructure (Auth, Config, Logger, Database)
│   └── database/
│       └── prisma.service.ts
└── ...

**Path Aliases:**
- You **MUST** use path aliases defined in `tsconfig.json` (e.g., `#modules`, `#core`, `#business`) instead of relative paths like `../../`.
```

---

## 3) LAYER RULES & INTER-COMMUNICATION

### 3.1 API Layer
- **Responsibility:** Orchestration, DTO Validation, Swagger Doc.
- **Forbidden:** Logic implementation, DB access.

### 3.2 Module Layer (Services)
- **Responsibility:** Implement use-cases for *its own* domain.
- **Forbidden:**
  - ❌ Importing other Modules (e.g., `UserModule` cannot import `OrderModule`).
  - ❌ Using DTOs (Must use Models).
  - ❌ Returning Entities directly (Must return Output Models).

### 3.3 Business Layer (The "Glue")
- **Responsibility:** Shared logic, complex validations, and cross-domain calculations.
- **Prisma Usage:** ✅ **ALLOWED** but with strict restrictions:
  1.  **Read-Only:** MUST NOT perform writes (create/update/delete).
  2.  **Validation Only:** Data fetching for API responses is FORBIDDEN. Use it only for internal logic/validation checks.
  3.  **No Transactions:** MUST NOT initiate Prisma transactions.
  4.  **Direct Access:** May use `PrismaService` to query data required for logic.
- **Return Values:** Can return Booleans (validations) or Data (calculations).

### 3.4 Datasource Layer
- **Responsibility:** Encapsulate all Prisma writes and module-specific reads.
- **Output:** Transforms Prisma Types → Domain Entities.

---

## 4) MODELS vs DTO vs ENTITY

**AI MUST distinguish between these three types:**

| Type | Suffix | Location | Purpose |
| :--- | :--- | :--- | :--- |
| **DTO** | `.dto.ts` | `api/.../dtos` | HTTP Contract (Class-Validator) |
| **Model** | `.input.ts`<br>`.output.ts` | `modules/.../models` | Service Input/Output (Plain Objects) |
| **Entity** | `.entity.ts` | `modules/.../entities` | Rich Domain Object (Internal) |

**Mapping Flow (MANDATORY):**
1. `Controller`: DTO → Input Model
2. `Service`: Input Model → (Logic) → Entity
3. `Datasource`: Prisma Type → Entity
4. `Service`: Entity → Output Model (using `plainToInstance`)
5. `Controller`: Output Model → Response DTO

**Strict Rule:**
- Services **NEVER** see DTOs.
- Controllers **NEVER** see Entities.

---

## 5) CROSS-MODULE COMMUNICATION STRATEGY

Since `Module A` cannot import `Module B` to avoid circular dependencies:

**Scenario A: Validation / Read Check (Synchronous)**
- Use **Business Layer**.
- *Example:* `OrderService` needs to check `Product` stock.
- *Solution:* Inject `StockAvailabilityRule` (from `src/business/rules`) into `OrderService`. The Rule queries Prisma directly (Read-Only).

**Scenario B: Side Effect / Write (Asynchronous)**
- Use **Event Emitter**.
- **Naming Convention:** `domain.entity.action` (past tense).
  - *Examples:* `user.password.changed`, `order.payment.completed`.
- *Example:* After `Order` is created, notify `NotificationModule`.
- *Solution:* `OrderService` emits `order.created`. `NotificationListener` listens and handles it.

---

## 6) ERROR HANDLING

- **Define Errors:** In `src/constants/error-code.constant.ts` & `error-message.constant.ts`.
- **Throw Errors:** Use Module-specific Exceptions (e.g., `UserException.notFound()`).
- **Forbidden:** Do not throw generic `Error` or NestJS `HttpException` directly in services.

---

## 7) SWAGGER RULES

- **Separate Files:** Responses MUST be defined in `api/.../swagger/{name}.response.ts`.
- **Helpers:** Use `SwaggerHelpers` for standard responses.
  - Available methods: `.success()`, `.created()`, `.noContent()`, `.notFound()`, `.unauthorized()`, `.forbidden()`, `.badRequest()`.
  - Check `src/shared/swagger/swagger.helpers.ts` for the full list.
- **Controller:** Link using `@ApiResponses(createMerchantResponse)`.

---

## 8) PRISMA GUIDELINES

- **Location:** Prisma Client usage is restricted to:
  1. `src/modules/*/datasources/*.datasource.ts` (Writes & Reads)
  2. `src/business/**/*` (**Read-Only** queries)
- **Service Injection:** NEVER inject `PrismaService` into a `Service`. Inject the `Datasource` or `BusinessRule` instead.

---

## 9) AI CODING CHECKLIST

Before generating code, verify:

1.  [ ] **Layer Check:** Am I putting logic in Controller? (Stop. Move to Service).
2.  [ ] **DB Access Check:** Am I writing to DB in Business Layer? (Stop. Move to Datasource).
3.  [ ] **Type Check:** Am I passing DTOs to Service? (Stop. Create an Input Model).
4.  [ ] **Return Check:** Am I returning a raw Prisma object? (Stop. Map to Output Model).
5.  [ ] **Swagger Check:** Did I create a separate Swagger response file?
6.  [ ] **File Structure:** Did I create files in both `src/api` and `src/modules`?

---

## 10) CODING STANDARDS & STYLE (MICRO-RULES)

AI must follow these coding styles to ensure readability and maintainability.

### 10.1 Immutability & Variables
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

### 10.2 Function Structure (RO-RO Pattern)
- **Receive Object:** If a function takes more than 2 arguments, strictly use a dedicated Input Model / Object.
- **Return Object:** Always return a typed object or specific Output Model.
- **Max Parameters:** Public methods should clearly name their inputs via interface/class.

```ts
// ✅ CORRECT
async createUser(input: CreateUserInput): Promise<UserOutput> { ... }

// ❌ WRONG
async createUser(email: string, age: number, name: string): Promise<UserOutput> { ... }
```

### 10.3 Control Flow (Early Returns)
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

### 10.4 Naming Conventions
- **Booleans:** Must start with a verb (`isActive`, `hasPermission`, `canDelete`).
- **Functions:** Must start with a verb (`create`, `find`, `update`, `calculate`).
- **Variables:** `camelCase`.
- **Classes/Interfaces:** `PascalCase`.

### 10.5 Testing Standards (AAA Pattern)
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
*End of Architecture Rules*