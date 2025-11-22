# 🌱 Seeding Data (Prisma)

This project uses **Prisma** for database seeding.

---

## ✅ How to Run

The seed script is defined in `package.json`:

```json
"scripts": {
  "seed": "ts-node --transpile-only src/database/seed.ts"
}
```

To run the seed:

```bash
npm run seed
```

Or using Prisma CLI:

```bash
npx prisma db seed
```

---

## 📝 Seed File Structure

The main seed file is located at `src/database/seed.ts`.

```ts
// src/database/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const mobile = '0812345678';
  const password = 'password123';
  const hashed = await bcrypt.hash(password, 12);

  // Check existing user
  const existing = await prisma.user.findFirst({
    where: { mobile }
  });

  if (existing) {
    console.log('User already exists:', existing.mobile);
    return;
  }

  // Create new user
  await prisma.user.create({
    data: {
      mobile,
      password: hashed,
      fullName: 'Admin User',
      isActive: true,
    },
  });

  console.log('✅ Seeded user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 💡 Best Practices

1.  **Idempotency**: Always check if data exists before creating it to avoid duplicates or errors on re-runs.
2.  **Modular Seeding**: For large datasets, split seed logic into separate functions or files and import them into `main()`.
