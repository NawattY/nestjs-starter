# ARCHITECTURE — Clean Modular Monolith (Updated with `src/business`)

## 1. Overview

This project uses a Clean Modular Monolith architecture with 4 clear layers:

```
API Layer
Application Layer (modules)
Business Layer (shared business logic)
Infrastructure Layer (Prisma, Redis, external APIs)
```

**Key intentions:**
- API is thin (controller-only)
- Modules handle feature-specific flows
- Business rules shared across modules live in `src/business`
- Core framework pieces live in `src/core`
- Infrastructure adapters live under `src/core/database` or module-specific datasources

---

## 2. Folder Structure

```
src/
 ├── api/                     # HTTP controllers (no business logic)
 │   └── v1/                  # Versioning support
 ├── modules/                 # Feature application logic (Order, Cart, Staff)
 ├── business/                # Shared business rules (Product, Staff, User)
 ├── core/                    # Framework-level code (config, logger, prisma)
 ├── shared/                  # Utilities (non-business)
 ├── config/                  # registerAs() typed configuration
 ├── constants/               # domain enums, error codes
 ├── database/                # Prisma schema + migrations
 ├── app.module.ts            # Application root
 └── main.ts                  # Bootstrap
```

---

## 3. Layer Responsibilities

### API Layer (`src/api`)
- Controllers only  
- Accept requests, validate DTOs  
- Call application-layer services (modules)  
- No Prisma, no business rules  

### Application Layer (`src/modules`)
- Per-feature business flow (OrderService, CartService, StaffService)  
- Coordinates rules from `src/business`  
- Does not access Prisma directly  

### Business Layer (`src/business`)
Shared business logic and policies used by multiple modules, e.g:

- product-rule.service.ts  
- product-status.policy.ts  
- staff-permission.rule.ts  
- user-status.policy.ts  

Allowed to use PrismaService if business rule requires DB verification  
(Example: check product availability before ordering)  
**IMPORTANT:** Must be **READ-ONLY**. No writes allowed here.

### Infrastructure Layer (`src/core/database`)
- PrismaService  
- External API clients  
- Redis providers  
- Email/SMS adapters  

---

## 4. Dependency Rules

### Allowed:
- api → modules  
- modules → business  
- business → core (Prisma)  
- modules → constants / shared utilities  
- api → shared  

### Not allowed:
- module → module  
- business → modules  
- api → business (should go through modules)  
- core → business  

---

## 5. Example Flow

### Example: User update requires status validation

```
UserController
   → UserService
        → UserModificationRule (src/business/rules)
             → PrismaService (core/database)
```

### Example: User deletion requires active order check

```
UserController
   → UserService
        → UserDeletionRule (src/business/rules)
             → PrismaService
```

---

## 6. Business Layer (Critical Concept)

`src/business` is the **shared business rule layer**.

Characteristics:
- Contains cross-module business logic  
- Can use Prisma  
- Does NOT belong inside modules  
- Changes when business rules change  
- Keeps modules thin and prevents duplication

Examples:
```
src/business/rules/user-modification.rule.ts
src/business/rules/user-deletion.rule.ts
```

---

## 7. Module Isolation

Feature modules **must not reference each other**.
- **Synchronous (Read/Validate):** Use `src/business` rules.
- **Asynchronous (Side Effects):** Use **Event Emitters**.

Example:  
OrderModule needs to check user status → it calls UserStatusRule in `src/business/rules`.
OrderModule needs to notify user → it emits `order.created` event.

---

## 8. Composition Root

`AppModule`:
- Loads CoreConfigModule, DatabaseModule  
- Loads all domain modules  
- Loads ApiModule  

`ApiModule`:
- Only imports DomainModule (if used)  
- Declares controllers only  

---

## 9. Prisma Usage Rules

- Modules MUST NOT use Prisma directly in Services (Use Datasource Adapter)
- Business Layer MAY use Prisma (Read-Only)
- Infrastructure Layer implements PrismaService
- Datasource (in module) defines Prisma adapters for Writes/Reads  

---

## 10. Summary

- `src/business` = **shared business logic layer**  
- `src/modules` = per-feature workflow  
- `src/api` = controllers only  
- `src/core` = framework components  
- `src/database` = schema + migrations  
- No module-to-module communication  
- All cross-feature logic stays in business layer  

This structure is scalable, testable, and prevents circular dependencies.
