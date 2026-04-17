# Current Repository Reference

เอกสารนี้สรุป state ปัจจุบันของ repository เพื่อให้ AI ใช้อ้างอิงตอนเขียนโค้ดโดยไม่ต้องอนุมานจาก migration history

## Current Module Inventory

- feature modules ปัจจุบันมี `auth` และ `user`
- แต่ละ feature module ใช้โครง `api`, `application`, `domain`, `infrastructure`, `exceptions`, `{module}.module.ts`
- route constants อยู่ที่ `src/routes/app-routes.constant.ts`
- top-level `src/api` แบบเดิมไม่มีแล้ว

## Current Core Inventory

`src/core/` ปัจจุบันมี:

- `api-docs` สำหรับ serve Scalar และ static OpenAPI
- `auth` สำหรับ JWT, guard, decorator, auth contract ที่ใช้ข้าม module
- `cache`, `redis` สำหรับ cache/redis integration
- `config` สำหรับ env loading และ typed config access
- `database` สำหรับ Prisma service และ DB bootstrap behavior
- `event`, `exceptions`, `interceptors`, `pipes`, `logger`, `mailer`, `file-upload`

### Legacy Note

- `src/core/swagger/` ยังมี directory เปล่าอยู่ แต่ไม่ใช่ source of truth และไม่ควรใช้สร้าง doc flow ใหม่
- runtime docs wiring จริงอยู่ที่ `src/core/api-docs/api-docs.setup.ts`

## Import Policy

- ใช้ relative imports เท่านั้นสำหรับ internal source code
- ห้ามเพิ่ม project-wide alias เช่น `@app/*` กลับเข้ามาอีก
- package import ใช้เฉพาะ third-party package หรือ monorepo package จริงถ้ามีในอนาคต

## Config And Validation Policy

- env loading ใช้ `ConfigModule.forRoot(...)` ใน `src/core/config/config.module.ts` เป็น source of truth เดียว
- config factories ใต้ `src/config/*.config.ts` อ่านค่าจาก `process.env`
- env/config validation ใช้ `zod`
- request DTO validation ใช้ `class-validator` และ `class-transformer`
- ถ้าจะเพิ่ม env ใหม่ ให้เพิ่มใน config schema ที่เกี่ยวข้อง ไม่ใช่สร้าง loader path ใหม่

## Database Policy

- `DATABASE_URL` เป็น optional ได้ในระดับ bootstrap
- `DATABASE_CONNECT_ON_BOOT` ใช้คุมว่าจะ eager connect ตอน start หรือไม่
- `PrismaService.onModuleInit()` จะ connect เฉพาะเมื่อมี URL และเปิด `connectOnBoot`
- DB-backed datasource/rule ต้องเรียก `PrismaService.ensureConnection()` ก่อนใช้งาน DB
- transaction pattern หลักยังใช้ `TransactionHost<TransactionalAdapterPrisma>`

## API Contract Policy

- canonical contract อยู่ที่ `openapi/openapi.yaml`
- human docs render ผ่าน Scalar ที่ `/docs`
- raw contract เสิร์ฟที่ `/openapi/openapi.yaml`
- ถ้า API เปลี่ยน ต้องอัปเดต OpenAPI พร้อมกับโค้ด
- ห้ามสร้าง source of truth ชุดที่สอง เช่น controller-driven contract, swagger response helper files, หรือ Bruno-first artifacts

## Testing Layout

- unit tests ปัจจุบันอยู่ใต้ `test/unit/**`
- e2e tests ปัจจุบันอยู่ที่ `test/*.e2e-spec.ts`
- source-level spec ที่ยังมีอยู่ เช่น `src/app.controller.spec.ts` ยังใช้ Jest config หลักของ repo
- architecture validation ใช้ `.dependency-cruiser.js`

## Commands AI Should Reach For First

1. `npm run lint`
2. `npm run build`
3. `npm run test:unit -- --runInBand`
4. `npm run test:e2e -- --runInBand`
5. `npm run test:arch`
6. `npm run openapi:lint`

## Practical Guardrails

1. ถ้าเพิ่ม feature module ใหม่ ให้ใช้โครงสร้างเดียวกับ `auth` และ `user`
2. ถ้าเพิ่ม endpoint ใหม่ ให้เพิ่ม route constant, controller behavior, application flow, และ OpenAPI contract ไปพร้อมกัน
3. ถ้าจะใช้ DB ใน infrastructure/application rule ให้เคารพทั้ง transaction host และ lazy DB connection behavior
4. ถ้า doc เชิงประวัติกับโค้ดจริงขัดกัน ให้ยึดโค้ดจริงร่วมกับเอกสาร current-state เช่นไฟล์นี้, `ai/project-overview.md`, `ai/architecture-rules.md`, และ `ai/coding-standards.md`