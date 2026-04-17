# Codebase Alignment Phase Plan

## Objective

Align the current NestJS codebase with:

- `ai/architecture-rules.md`
- `ai/coding-standards.md`

This plan is intentionally split into phases so the migration can be executed across multiple chat rounds without overflowing context or leaving the repository in an unstable half-migrated state.

## Current Baseline

### Structural gaps found

1. API controllers live under `src/api/v1/...` instead of `src/modules/{module}/api/...`.
2. Route constants do not exist yet; controllers hardcode paths and versions.
3. Module internals are not separated into `api`, `application`, `domain`, and `infrastructure` layers.
4. Datasources inject `PrismaService` directly instead of `TransactionHost<TransactionalAdapterPrisma>`.
5. `src/business/...` currently contains rules coupled to Prisma, which conflicts with the target modular architecture.
6. DTO immutability is inconsistent; many DTO fields are not `readonly`.
7. Controller-to-service boundaries are loose; some controller code maps DTOs directly into service payloads without an explicit application input boundary.
8. The repository currently uses the `#* -> src/*` path alias, while the architecture document examples also mention `@app/*`.
9. Some tests appear stale relative to the current folder structure, so test updates should be planned as part of the migration rather than treated as incidental breakage.
10. The application currently uses `VersioningType.URI` in `src/main.ts`, while the architecture document examples show route constants that already include `v1/...`; this must be reconciled before route centralization starts.

### Representative files

- `src/api/v1/auth/controllers/auth.controller.ts`
- `src/api/v1/user/controllers/user.controller.ts`
- `src/api/v1/api.module.ts`
- `src/modules/auth/auth.module.ts`
- `src/modules/user/user.module.ts`
- `src/modules/auth/services/auth.service.ts`
- `src/modules/user/services/user.service.ts`
- `src/modules/auth/datasources/auth.prisma.datasource.ts`
- `src/modules/user/datasources/user.prisma.datasource.ts`
- `src/business/rules/user-modification.rule.ts`
- `test/auth.e2e-spec.ts`
- `test/user.e2e-spec.ts`

## Migration Principles

1. Keep each phase releasable on its own.
2. Prefer low-risk foundation work before folder moves.
3. Do not mix route refactors, folder moves, and transaction rewrites in one round unless the slice is very small.
4. Validate touched files with lint/tests in the same phase.
5. Migrate module-by-module where possible, starting with `auth` and `user`.

## Phase 0: Lock Conventions Before Refactor

### Goal

Resolve ambiguities in the target conventions before changing runtime code.

### Tasks

1. Decide the canonical import alias for the project.
   - Option A: keep `#...` and adapt the docs locally.
   - Option B: migrate repo-wide to `@app/*`.
2. Confirm whether `src/business/...` should be removed entirely or retained only for truly shared domain rules.
3. Confirm whether the migration will preserve current HTTP paths exactly while internal structure changes.
4. Confirm whether `nestjs-cls` transaction support should be introduced now or deferred until after the folder restructuring.
5. Decide the route constant format under URI versioning.
  - Option A: route constants store only resource paths like `auth`, `users`, `me` and keep Nest URI versioning.
  - Option B: route constants store `v1/...` and the app stops using URI versioning.

### Exit criteria

1. One canonical alias strategy is chosen.
2. One target for `src/business/...` is chosen.
3. One transaction rollout strategy is chosen.
4. One route/versioning strategy is chosen.

## Phase 1: Route Foundation

### Goal

Remove hardcoded routing from controllers without changing business behavior.

### Tasks

1. Create `src/routes/app-routes.constant.ts`.
2. Define route constants for current v1 endpoints.
3. Update all controllers to use route constants instead of hardcoded path strings.
4. Keep existing external URLs unchanged.
5. Update Swagger decorators only where required by the route refactor.

### Scope candidates

1. `src/api/v1/auth/controllers/auth.controller.ts`
2. `src/api/v1/user/controllers/user.controller.ts`
3. Any controller added later under `src/api/v1/...`

### Verification

1. Lint touched controller and route files.
2. Run focused controller or e2e tests for auth/user endpoints.
3. Confirm generated routes still match current API contract.

## Phase 2: API Boundary Cleanup

### Goal

Make the API layer conform more closely to the DTO and application-model rules before moving folders.

### Tasks

1. Add `readonly` to DTO properties where missing.
2. Ensure controllers convert DTOs into application input models explicitly.
3. Ensure services do not receive transport DTO classes directly.
4. Normalize response mapping so controllers return response DTOs and services return application outputs.
5. Clean up import ordering in touched files.

### Scope candidates

1. `src/api/v1/auth/dtos/**`
2. `src/api/v1/user/dtos/**`
3. `src/modules/auth/models/**`
4. `src/modules/user/models/**`
5. `src/api/v1/auth/controllers/auth.controller.ts`
6. `src/api/v1/user/controllers/user.controller.ts`

### Verification

1. Lint all touched DTO, controller, and model files.
2. Run focused tests for auth and user controllers/services.
3. Confirm no DTO classes leak into service signatures.

## Phase 3: Feature Folder Restructure Per Module

### Goal

Move each module toward the target 4-layer structure with minimal behavioral change.

### Strategy

Do this one module at a time. Recommended order:

1. `auth`
2. `user`

### Target structure per module

```text
src/modules/{module}/
  api/
    controllers/
    dtos/
    swagger/
  application/
  domain/
    entities/
    value-objects/
    enums/
  infrastructure/
    datasources/
  exceptions/
  {module}.module.ts
```

### Tasks per module

1. Move controllers from `src/api/v1/{module}/controllers` into `src/modules/{module}/api/controllers`.
2. Move DTOs into `src/modules/{module}/api/dtos`.
3. Move Swagger files into `src/modules/{module}/api/swagger`.
4. Rename `services` to `application`.
5. Move `entities` into `domain/entities`.
6. Move datasource files into `infrastructure/datasources`.
7. Update module imports and `src/api/v1/api.module.ts` wiring.
8. Remove obsolete folder paths only after references are updated.

### Verification

1. Lint all moved files for the module.
2. Run unit tests for the module.
3. Run relevant e2e tests after each module migration.
4. Confirm Nest module boot still succeeds.

## Phase 4: Infrastructure and Transaction Compliance

### Goal

Bring datasource and transaction handling in line with the architecture rules.

### Tasks

1. Verify or add required transaction packages.
   - `@nestjs-cls/transactional`
   - `@nestjs-cls/transactional-adapter-prisma`
2. Configure CLS transaction support in the application bootstrap/module layer.
3. Refactor datasource implementations to use `TransactionHost<TransactionalAdapterPrisma>`.
4. Ensure each datasource exposes a clear entity transformation method.
5. Remove direct `PrismaService` injection from module datasources.
6. Decide whether shared helpers like pagination need transaction-aware updates.

### Scope candidates

1. `src/modules/auth/datasources/auth.prisma.datasource.ts`
2. `src/modules/user/datasources/user.prisma.datasource.ts`
3. `src/core/database/**`
4. `src/shared/helpers/prisma-paginate.helper.ts`
5. `src/app.module.ts`

### Verification

1. Lint all touched infrastructure files.
2. Run unit/integration tests that exercise datasource methods.
3. Confirm basic CRUD flows still work.

## Phase 5: Business Rule and Cross-Module Boundary Cleanup

### Goal

Resolve the architectural conflict created by `src/business/...` and enforce cleaner domain ownership.

### Tasks

1. Audit `src/business/rules` and `src/business/exceptions`.
2. Move module-specific rules into the owning module's domain or application layer.
3. Keep only truly shared, framework-agnostic logic in a shared location.
4. Remove direct Prisma-dependent rules from cross-cutting folders.
5. Add `forwardRef()` only if circular module dependencies actually appear.

### Verification

1. Lint all touched files.
2. Run unit tests around affected rules/services.
3. Run dependency analysis if the project relies on `test:arch`.

## Phase 6: Exception, Swagger, and Test Alignment

### Goal

Finish the remaining consistency work after the structure is stable.

### Tasks

1. Standardize exception factories to the documented pattern where still inconsistent.
2. Ensure Swagger response definitions live inside each module API layer.
3. Update stale test imports and route assumptions.
4. Add or repair tests for the migrated module boundaries.
5. Update docs if the chosen alias strategy differs from the attached architecture document examples.

### Verification

1. Run lint for all touched files.
2. Run targeted unit and e2e tests.
3. Run architecture checks if used in the repo.

## Recommended Execution Slices

To keep each chat round small enough, execute the migration in these slices:

1. Phase 0 decisions + Phase 1 for `auth` and `user`.
2. Phase 2 for `auth` only.
3. Phase 2 for `user` only.
4. Phase 3 for `auth` only.
5. Phase 3 for `user` only.
6. Phase 4 for `auth` and shared transaction setup.
7. Phase 4 for `user`.
8. Phase 5 and Phase 6 cleanup.

## Known Risks

1. Alias inconsistency between docs and current repo can create unnecessary churn if not decided first.
2. Folder moves will break imports, tests, and possibly editor assumptions if done too broadly in one round.
3. Transaction migration should not start before the target module structure is stable enough to support it.
4. Existing e2e tests appear out of sync with current file locations, so test failures may include pre-existing issues unrelated to a given phase.
5. Route centralization is blocked until the project chooses whether URI versioning stays in `main.ts` or moves into the route constants.

## Recommended First Implementation Round

The safest first round is:

1. Complete Phase 0 decisions.
2. Implement Phase 1.
3. If scope remains small enough, start Phase 2 only for DTO immutability and explicit DTO-to-input conversion in `auth`.

This gives immediate alignment progress without mixing route changes, folder moves, and transaction rewrites in the same pass.