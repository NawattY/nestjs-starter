# 🧪 Seeding Data (NestJS + TypeORM)

ใช้ระบบ Seeder สำหรับใส่ข้อมูลเริ่มต้น (Initial Data) ลงในฐานข้อมูล เช่น admin user เป็นต้น

---

## ✅ วิธีใช้งาน

### 1. เพิ่ม script ใน `package.json`

```json
"scripts": {
  "seed": "ts-node src/database/seeders/$npm_config_file"
}
```

> ✅ ข้อดี: ไม่ต้องแก้ package.json ทุกครั้งที่เพิ่ม seed ใหม่

---

### 2. สร้าง seed file ตัวอย่าง

**ไฟล์: `src/database/seeders/user.seeder.ts`**

```ts
import { DataSource } from 'typeorm';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { hash } from 'bcryptjs';
import ormConfig from '@/database/orm.config';

export default async function seedUser() {
  const dataSource = await ormConfig.initialize();

  const repo = dataSource.getRepository(UserEntity);

  const user = repo.create({
    email: 'admin@example.com',
    password: await hash('password123', 10),
    fullName: 'Admin User',
    isActive: true,
  });

  await repo.save(user);
  console.log('✅ Seeded user');
  await dataSource.destroy();
}
```

---

### 3. สั่งรัน seed

```bash
npm run seed --file=user.seeder.ts
```

หรือถ้าเก็บไว้ในโฟลเดอร์ย่อย

```bash
npm run seed --file=auth/admin.seeder.ts
```

---

## 📝 หมายเหตุ

- รองรับการเขียน seed แบบแยกตามโมดูล
- สามารถเขียนหลาย seed และเรียกใช้แยกกันได้
