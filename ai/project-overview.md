# Project Overview For AI

## Purpose

NestJS starter นี้เป็น modular monolith ที่ตั้งค่าไว้สำหรับ AI-first development
AI ต้องใช้เอกสารใน `ai/` คู่กับ source code ปัจจุบัน เพื่อให้การ generate code ใหม่สอดคล้องกับแนวทางที่วางไว้

## API Contract Workflow

1. canonical API contract อยู่ที่ `openapi/openapi.yaml`
2. human-friendly docs render ผ่าน Scalar ที่ `/docs`
3. raw OpenAPI file เสิร์ฟที่ `/openapi/openapi.yaml`
4. Bruno ถ้าใช้ ต้อง consume จาก OpenAPI แทนที่จะเป็น source of truth แยกอีกชุด

## Implementation Baseline

1. feature modules อยู่ใต้ `src/modules/{module}` และแยก `api`, `application`, `domain`, `infrastructure`
2. centralized routes อยู่ที่ `src/routes/app-routes.constant.ts`
3. internal imports ใช้ relative path เท่านั้น
4. database access อยู่ใน datasource/rule ที่เหมาะสม และต้องเคารพ transaction pattern ของ repo
5. docs สำหรับ AI อยู่ใต้ `ai/`; API contract อยู่ใต้ `openapi/`
6. env/config validation ใช้ `zod` แต่ request DTO validation ยังใช้ `class-validator`
7. runtime API docs setup อยู่ที่ `src/core/api-docs/api-docs.setup.ts`

## Useful Commands

1. `npm run start:dev` สำหรับรันแอปและเปิด Scalar ที่ `/docs`
2. `npm run openapi:lint` สำหรับตรวจ OpenAPI ด้วย Spectral
3. `npm run lint` สำหรับตรวจและจัด code style
4. `npm run build` สำหรับตรวจ compile
5. `npm run test:unit -- --runInBand`
6. `npm run test:e2e -- --runInBand`
7. `npm run test:arch`

## AI Guardrails

1. อย่าสร้าง parallel contract artifact เพิ่ม ถ้ายังไม่ถูกขอชัดเจน
2. อย่ากลับไปใช้ import alias แบบ `@app/*`
3. ถ้าจะเพิ่ม module ใหม่ ให้ทำ structure ครบตั้งแต่แรกตาม `ai/architecture-rules.md`
4. ถ้า docs ขัดกับโค้ด ให้ตรวจว่าเป็น rule-level intent หรือเป็น implementation drift ก่อนตัดสินใจแก้
5. ถ้าต้องการข้อเท็จจริงของ repo ปัจจุบัน ให้เปิด `ai/current-repo-reference.md` ก่อนอ่านเอกสารเชิงประวัติ