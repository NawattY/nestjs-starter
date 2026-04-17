# Architecture Follow-up

## Scope

This note captures the two architecture issues that were identified during the boilerplate review and the intended direction for the next changes.

## Issue 1: Config source of truth split

### Problem

- `src/core/config/config.module.ts` already loads and validates environment variables through `@nestjs/config`.
- Several config factories re-parse env files through `src/core/config/utils/read-environment.util.ts`.
- This creates two independent env-loading paths with duplicated file precedence logic.

### Risks

- Env precedence can drift between the two implementations.
- Future changes to env loading behavior need to be made in more than one place.
- Bootstrap behavior becomes harder to reason about and debug.

### Target state

- `ConfigModule.forRoot(...)` remains the only env-loading mechanism.
- Config factories read from `process.env` after core validation has populated the process environment.
- Duplicated env file parsing logic is removed.

### Change set

- Keep `validateCoreConfig()` returning the merged config so non-core env keys are preserved.
- Remove `read-environment.util.ts`.
- Update auth/database/logger/redis config factories to read from `process.env` only.

## Issue 2: Database hard-coupled to bootstrap

### Problem

- `PrismaService.onModuleInit()` eagerly calls `$connect()` during app startup.
- This makes the entire app fail at bootstrap whenever the database is unavailable.
- For a starter boilerplate, that is too aggressive because docs/basic smoke use should not require the DB to be reachable immediately.

### Risks

- `/docs` and other non-DB concerns cannot be exercised without a working database.
- Local development and early project scaffolding require infrastructure too early.

### Target state

- Prisma remains available to DB-backed features.
- The app can start without eagerly connecting to the database.
- Teams that want fail-fast DB startup can opt in explicitly.

### Change set

- Make database config allow an empty `DATABASE_URL`.
- Add `DATABASE_CONNECT_ON_BOOT` with a default of `false`.
- Only call `PrismaService.$connect()` during bootstrap when both:
  - a database URL is configured
  - `DATABASE_CONNECT_ON_BOOT=true`

### Expected trade-off

- DB-backed endpoints will still fail when used without a valid database configuration.
- That is acceptable for boilerplate bootstrap because the goal is to decouple startup, not to fake database behavior.

## Validation

- `npm run build`
- `npm run test:unit -- --runInBand`
- `npm run test:e2e -- --runInBand`
- `npm run test:arch`