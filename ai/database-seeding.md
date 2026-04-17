# 🌱 Seeding Data (Prisma)

This project uses **Prisma** for database seeding.

> Current seed entrypoint: `src/database/seed.ts`

---

## AI Notes

- seed logic ควรเป็น idempotent
- ใช้ `async/await` ตรง ๆ ไม่ใช้ `.then()` chain เป็น flow หลัก
- ถ้าต้องใช้งาน enum/shared type ให้ import จาก source code จริง เช่น `src/shared/enums`
- ถ้าปรับ seed data ให้ดู schema ปัจจุบันใน `src/database/schema.prisma` ประกอบเสมอ

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

import { CommonStatus } from '../shared/enums';

const prisma = new PrismaClient();

async function main() {
  const mobile = '0999999999';
  const email = 'admin@example.app';
  const password = 'password';
  const hashed = await bcrypt.hash(password, 12);

  // Check existing super admin
  const existing = await prisma.user.findFirst({
    where: { mobile },
  });

  if (existing) {
    console.log('Super admin already exists:', existing.mobile);
    return;
  }

  const user = await prisma.user.create({
    data: {
      mobile,
      email,
      password: hashed,
      status: CommonStatus.ACTIVE,
    },
  });

  console.log('Super admin created:');
  console.log(' User ID:', user.id);
  console.log(' Mobile:', mobile);
  console.log(' Email:', email);
}

async function bootstrapSeed() {
  try {
    await main();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void bootstrapSeed();
```

---

## 💡 Best Practices

1.  **Idempotency**: Always check if data exists before creating it to avoid duplicates or errors on re-runs.
2.  **Modular Seeding**: For large datasets, split seed logic into separate functions or files and import them into `main()`.
