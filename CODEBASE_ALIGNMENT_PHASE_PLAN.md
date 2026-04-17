# Codebase Alignment Phase Plan

## Objective

Align the current NestJS codebase with:

- `ai/architecture-rules.md`
- `ai/coding-standards.md`

This plan is intentionally split into phases so the migration can be executed across multiple chat rounds without overflowing context or leaving the repository in an unstable half-migrated state.

## Locked Decisions

1. Internal imports should prefer relative paths over project-wide aliases.
2. Route versioning must live in `src/routes/app-routes.constant.ts`.
3. Nest URI versioning in `main.ts` should be removed as route constants are adopted.
4. Temporary compatibility for legacy `#...` imports is allowed only during migration phases.

## Current Status

### Completed in current round

1. Added a temporary `@app/*` path mapping in project configuration during the migration away from legacy `#...` imports.
2. Migrated `src` and `test` imports from `#...` to `@app/*` as an intermediate stabilization step.
3. Removed legacy `#...` alias mappings from project configuration.
4. Added `src/routes/app-routes.constant.ts` for current `auth` and `user` v1 endpoints.
5. Removed Nest URI versioning from `src/main.ts`.
6. Updated `auth` and `user` controllers to use centralized route constants.
7. Updated affected tests to use current controller paths, centralized routes, and current service method names.
8. Applied `readonly` to auth/user API DTO properties in the current scope.
9. Moved `auth` API files under `src/modules/auth/api/...` and made `AuthModule` own its controller.
10. Moved `user` API files under `src/modules/user/api/...` and made `UserModule` own its controller.
11. Moved `auth` and `user` services into `application/` and moved their used models into `application/models/{inputs,outputs}`.
12. Updated remaining `user` datasource imports to the new application-layer model paths.
13. Removed one stale auth DTO unit test that referenced a nonexistent source file.
14. Moved `auth` and `user` entities into `domain/entities`.
15. Moved `auth` and `user` datasources into `infrastructure/datasources` and updated their imports.
16. Made controller-to-application boundaries explicit by constructing input models in `auth` and `user` controllers.
17. Added `nestjs-cls` transactional wiring and migrated `auth` and `user` datasources from `PrismaService` to `TransactionHost<TransactionalAdapterPrisma>`.
18. Moved the remaining `UserModificationRule` out of `src/business` and into `src/modules/user/application/rules`, with a module-local user exception.
19. Aligned `test/jest-e2e.json` to `@swc/jest` during the alias transition phase.
20. Added `test/jest-unit.json` and the `test:unit` npm script for unit specs under `test/unit`.
21. Fixed strict-mode DTO test assertions and cleaned up `test/tsconfig.json` diagnostics.
22. Enabled SWC decorator support across all Jest entrypoints used by the repo.
23. Updated AI guidance docs during the alias transition phase.
24. Updated `.dependency-cruiser.js` to remove `src/business` assumptions and match the `application/domain/infrastructure` folder layout.
25. Re-validated the migrated auth/user slice with build, e2e, and unit test runs.
26. Re-ran dependency-cruiser and confirmed no architecture rule violations in the current `src` graph.
27. Moved reusable Swagger response helpers from `src/api/common` into `src/shared/helpers` and updated module Swagger imports.
28. Re-ran build and architecture validation after the Swagger helper relocation.
29. Moved `JwtPayload` into `src/core/auth` so shared decorators and non-auth modules no longer depend on the auth feature module for a common auth contract.
30. Re-ran build, architecture validation, and e2e coverage after relocating the shared JWT payload contract.
31. Removed empty legacy directories under `src/api/v1/auth` and `src/api/v1/user` after the feature controller migration.
32. Removed the remaining `ApiV1Module` wrapper and let `ApiModule` compose feature modules directly.
33. Removed the now-empty `src/api/v1` directory and re-validated build plus dependency boundaries.
34. Removed `src/api/api.module.ts` and imported `AuthModule` plus `UserModule` directly in `AppModule`.
35. Moved Swagger bootstrap setup from `src/api/swagger.setup.ts` into `src/core/swagger/swagger.setup.ts`.
36. Removed the obsolete dependency-cruiser rule that referenced the deleted top-level `src/api` layer.
37. Removed the now-empty `src/api` directory and re-validated build, dependency rules, and e2e coverage.
38. Moved `SwaggerHelpers` from `src/shared/helpers` into `src/core/swagger` so all Swagger-specific support now lives in one framework-facing location.
39. Grouped `AppModule` imports into core modules, feature modules, and global providers for a clearer composition root.
40. Re-ran build, dependency validation, and e2e coverage after moving Swagger helpers into `src/core/swagger` and cleaning up `AppModule` composition.
41. Deleted `doc/ARCHITECTURE.md` to avoid duplicate architecture guidance while `ai/architecture-rules.md` remains the single source of truth during the migration.
42. Tightened dependency-cruiser rules so API, application, domain, and infrastructure layers have more precise cross-module restrictions.
43. Cleaned `main.ts` bootstrap wiring so CORS origin checks are deterministic and the startup flow is easier to read.
44. Re-ran build, dependency validation, and e2e coverage after removing the duplicate architecture doc and tightening bootstrap plus dependency guardrails.
45. Removed remaining default exports in config code, replaced seed `.then()` chaining with `async/await`, and aligned remaining output models with `readonly` requirements.
46. Extracted application bootstrap wiring from `main.ts` into `src/core/config/utils/configure-app.util.ts` so startup concerns live in one reusable core utility.
47. Added more specific architecture guardrails for API-to-domain/infrastructure imports, application-to-API imports, and domain purity.
48. Re-ran build, dependency validation, and e2e coverage after extracting bootstrap setup and tightening the remaining architecture guardrails.
49. Eliminated the remaining ESLint warnings, tightened several auth/core typing gaps, and re-ran lint, build, architecture validation, e2e, and unit tests successfully.
50. Migrated env/config validation from Joi and class-based config validators to Zod while keeping request DTO validation on class-validator, then re-ran lint, build, architecture validation, e2e, and unit tests successfully.
51. Consolidated reusable Zod env helpers for string, optional string, integer, boolean, and ms-duration parsing so config schemas stay consistent and easier to extend.
52. Added unit coverage for Zod config helpers and core env validation so coercion, defaults, empty-string handling, and validation error formatting are now regression-tested.
53. Added an AI-first API contract workflow with a checked-in `openapi/openapi.yaml` file as the primary spec and served Scalar docs from that file, leaving Bruno as an optional consumer instead of a second source of truth.
54. Updated AI architecture/coding rules to formalize the OpenAPI-first contract workflow and added Spectral-based `openapi:lint` validation for `openapi/openapi.yaml`.
55. Removed remaining Swagger code-first response artifacts and decorators from `src`, removed obsolete Swagger dependencies, and tightened Spectral rules to require request/response examples in the OpenAPI contract.
56. Renamed the runtime API docs bootstrap away from Swagger-specific naming and tightened Spectral further by requiring schema-level examples for `components.schemas`.
57. Tightened Spectral to require standard error responses so operations with validated input declare `400` and secured operations declare `401` in the OpenAPI contract.
58. Removed the temporary `@app/*` alias, migrated source and test imports to relative paths, and simplified TS/Jest configuration accordingly.

### Remaining follow-up

1. Tighten dependency rules further only if new feature modules are added or current core auth contracts are formalized differently.
2. Continue the same migration checklist when new feature modules are introduced beyond `auth` and `user`.

## Verified Current State

1. Source and test code now use relative imports instead of a project-wide `@app/*` alias.
2. Route versioning lives in `src/routes/app-routes.constant.ts` and `src/main.ts` no longer enables Nest URI versioning.
3. `src/modules` currently contains only `auth` and `user`, and both use `api`, `application`, `domain`, and `infrastructure` folders.
4. No standalone `src/business` layer remains in the runtime code.
5. Auth and user datasources use `TransactionHost<TransactionalAdapterPrisma>` instead of direct `PrismaService` injection.
6. Jest config for e2e and unit tests is aligned to `@swc/jest` and Nest decorator metadata without alias-specific mapping.
7. Reusable Swagger response helpers now live under `src/core/swagger`.
8. Shared JWT payload typing now lives under `src/core/auth` instead of the `auth` feature module.
9. `AppModule` imports feature modules directly, without any top-level `src/api` module layer remaining.
10. Swagger bootstrap setup and response helpers now live under `src/core/swagger` as part of application wiring.
11. No top-level `src/api` directory remains in the repository.
12. `ai/architecture-rules.md` is the only maintained architecture source until post-migration docs are recreated.
13. `npm run lint` now completes with zero errors and zero warnings.
14. Env/config validation now uses Zod across core bootstrap and per-config factories, while request DTO validation remains on class-validator.
15. Shared env parsing helpers now centralize common Zod config patterns, including empty-string handling for optional values such as Redis passwords.
16. Core config validation and shared Zod env helpers now have dedicated unit tests under `test/unit/core/config`.
17. The repository now exposes a checked-in OpenAPI contract at `openapi/openapi.yaml` and serves Scalar-based API docs from that file.
18. The repository now validates the OpenAPI contract with Spectral via `npm run openapi:lint`.
19. Runtime source code no longer maintains separate Swagger response helper files as a second API contract source.
20. Runtime docs wiring now lives under `src/core/api-docs` instead of Swagger-named setup code.

## Remaining Drift Found After Migration

1. Dependency-cruiser rules now distinguish API, application, domain, and infrastructure cross-module limits, but should still be revisited when additional modules introduce real integration cases.

## Validation Performed

1. `npm run openapi:lint`
1. `npm run lint`
1. `npm run build`
2. `npm run test:e2e -- --runInBand`
3. `npm run test:unit -- --runInBand`
4. `npm run test:arch`

## Recommended Next Slice

1. If new modules are introduced, apply the same `api/application/domain/infrastructure` structure immediately instead of relying on later migration.
2. Revisit dependency boundaries only when there is concrete new cross-module behavior to enforce, so rules stay aligned with real module contracts.