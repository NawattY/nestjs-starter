# NestJS Starter Template 🚀

Starter template สำหรับสร้าง NestJS REST API แบบ maintain ง่าย พร้อมโครงสร้างที่เป็นระเบียบ และโมดูลกลางพร้อมใช้ เช่น Logger, S3, JWT Auth, Pagination ฯลฯ

---

## 🔧 โครงสร้าง

```
src/
├── main.ts
├── app.module.ts              # รวมทุกโมดูลเข้าด้วยกัน

├── config/                    # จัดการ config/env
│   ├── config.module.ts
│   └── configuration.ts

├── shared/                    # ของที่แชร์ทุกโมดูล
│   ├── filters/               # ExceptionFilter
│   ├── decorators/            # เช่น @CurrentUser()
│   ├── interceptors/          # เช่น ClassSerializerInterceptor
│   ├── utils/                 # เช่น handleException
│   └── constants/             # เช่น default pagination config

├── database/                  # TypeORM config + migrations
│   ├── database.module.ts
│   └── orm.config.ts

├── modules/
│   ├── user/                  # ตัวอย่าง module ครบวงจร
│   └── auth/                  # JWT Auth แบบเรียบง่าย

├── common/                    # interfaces / base types / pagination dto
│   ├── dto/
│   └── interfaces/

├── libs/                      # โมดูลกลางที่สามารถ reuse ได้
│   ├── logger/                # Global LoggerService
│   └── s3/                    # Mocked S3Service
```

---

## 🧪 Start Dev

```bash
npm install
npm run start:dev
```

---

## 🧩 ใช้ Logger/S3 Module

```ts
import { LoggerModule } from '#libs/logger';
import { S3Module } from '#libs/s3';

@Module({
  imports: [LoggerModule, S3Module],
})
export class AppModule {}
```

```ts
constructor(private logger: LoggerService) {
  this.logger.log('Hello Logger');
}
```

---

## ✅ สิ่งที่ควรเพิ่มต่อ

- เพิ่ม JWT Auth Flow จริงใน `auth/`
- เพิ่ม DTO/Service/Controller ตัวอย่างใน `user/`
- เพิ่ม test coverage (unit + e2e)
- เพิ่ม .env และการโหลด config ด้วย `@nestjs/config`
- ตั้ง path alias ใน tsconfig.json ให้ใช้ `#libs/` เป็นต้น

---

สร้างโดย 💖 จุฑามณี (เทพ infra mode)
