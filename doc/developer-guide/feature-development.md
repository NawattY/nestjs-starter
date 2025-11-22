# Feature Development Guide

## Workflow Steps

1. **Module Setup**: Create module folder in `src/modules/`.
2. **Domain Modeling**: Define domain entities in `entities/` and models in `models/`.
3. **Datasource**:
    - Create interface `datasources/*.datasource.interface.ts`.
    - Implement Prisma adapter `datasources/*.prisma.datasource.ts`.
4. **Business Logic**:
    - Create Service in `services/`.
    - **Business Rules**: If logic is cross-domain or complex, create a Rule in `src/business/rules/`.
    - **Events**: If there are side effects (e.g., email), emit an Event.
5. **API Layer**:
    - Create DTOs in `src/api/v1/{module}/dtos/`.
    - Create Controller in `src/api/v1/{module}/controllers/`.
    - Add Swagger documentation.

## Reference Implementation

Check **`UserModule`** (`src/modules/user`) for the gold standard implementation:
- **Service**: `UserService`
- **Business Rule**: `UserModificationRule` (Direct Prisma access)
- **Event**: `UserUpdatedEvent`
- **Datasource**: `UserPrismaDataSource`

