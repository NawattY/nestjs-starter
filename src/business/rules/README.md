# Business Rules Layer

This directory contains reusable, cross-domain business rules.

## What goes here?
- **Rules**: Logic that applies across multiple modules (e.g., "User cannot be deleted if they have active orders").
- **Validations**: Complex validation logic that doesn't fit in a DTO or single service.

## Rules
- **Stateless**: Business rules should be stateless.
- **Read-Only**: They can read from Datasources but MUST NOT write to the database.
- **No Side Effects**: They should not trigger emails, events, or other side effects.

## Example

```ts
// src/business/rules/user-deletion.rule.ts
@Injectable()
export class UserDeletionRule {
  constructor(private readonly prisma: PrismaService) {}

  async validate(userId: string): Promise<void> {
    const activeOrders = await this.prisma.order.count({
      where: { userId, status: 'ACTIVE' }
    });
    
    if (activeOrders > 0) {
      throw new BusinessException('Cannot delete user with active orders');
    }
  }
}
```
