# NestJS Starter

NestJS starter สำหรับงาน backend แบบ modular monolith ที่ตั้ง baseline ด้าน architecture, validation, OpenAPI, และ testing ไว้ให้พร้อมเริ่มต่อยอดได้เร็ว

โปรเจกต์นี้เหมาะกับงานที่ต้องการ:

- NestJS + TypeScript strict mode
- Prisma + PostgreSQL
- Redis integration
- OpenAPI-first workflow
- โครงสร้าง module ชัดเจนแบบ `api / application / domain / infrastructure`
- ใช้งานร่วมกับ AI coding workflow ได้ง่าย

## Highlights

- OpenAPI-first: contract หลักอยู่ที่ [openapi/openapi.yaml](openapi/openapi.yaml)
- Scalar docs พร้อมใช้งานที่ `/docs`
- config/env validation ใช้ `zod`
- request DTO validation ใช้ `class-validator`
- transaction-aware datasource pattern ด้วย `nestjs-cls`
- architecture validation ด้วย dependency-cruiser
- unit test และ e2e test baseline พร้อมใช้งาน

## Tech Stack

- NestJS 11
- TypeScript
- Prisma
- PostgreSQL
- Redis
- Zod
- class-validator / class-transformer
- Scalar API Reference
- Jest + SWC

## Included Modules

ตอนนี้ starter มีตัวอย่าง feature module หลัก 2 ตัว:

- `auth`
- `user`

สองโมดูลนี้เป็น reference implementation ของโครงสร้างที่ repo นี้ใช้จริง

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Create environment file

คัดลอกจาก `.env.example` เป็น `.env`

ค่าขั้นต่ำที่ควรตั้งก่อนเริ่ม:

```env
APP_NAME=NestJS Starter
APP_HOST=localhost
APP_PORT=3000
NODE_ENV=local

JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

ถ้าจะใช้ database จริง ให้กำหนด `DATABASE_URL` เพิ่ม

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_CONNECT_ON_BOOT=true
```

## Run

### Development

```bash
npm run start:dev
```

เมื่อรันแล้ว endpoint สำคัญคือ:

- API base: `http://localhost:3000/api`
- Scalar docs: `http://localhost:3000/docs`
- Raw OpenAPI: `http://localhost:3000/openapi/openapi.yaml`

### Production build

```bash
npm run build
npm run start:prod
```

## Database

### Generate Prisma client

```bash
npm run prisma:generate
```

### Create and apply migration in development

```bash
npm run prisma:migrate
```

### Apply existing migrations in deployment environments

```bash
npm run prisma:migrate:deploy
```

### Seed data

```bash
npm run seed
```

## Quality Checks

```bash
npm run lint
npm run build
npm run test:unit -- --runInBand
npm run test:e2e -- --runInBand
npm run test:arch
npm run openapi:lint
```

## API Workflow

โปรเจกต์นี้ใช้แนวทาง OpenAPI-first:

1. แก้ contract ที่ [openapi/openapi.yaml](openapi/openapi.yaml)
2. ปรับ controller / DTO / application flow ให้ตรงกับ contract
3. ตรวจ contract ด้วย `npm run openapi:lint`
4. เปิดดูผลผ่าน Scalar ที่ `/docs`

ข้อสำคัญ: อย่าสร้าง API contract source of truth ชุดที่สอง

## Architecture Overview

โครงสร้างหลักของ feature module:

```text
src/modules/{module}/
├── api/
├── application/
├── domain/
├── infrastructure/
├── exceptions/
└── {module}.module.ts
```

แนวคิดหลัก:

- controller รับผิดชอบเรื่อง HTTP และ DTO validation
- application layer รับผิดชอบ use-case orchestration
- domain layer เก็บ domain model/pure rules
- infrastructure layer รับผิดชอบ data access

## Notes

- internal imports ใช้ relative path ไม่ใช้ project-wide alias
- app สามารถ bootstrap ได้แม้ยังไม่ต่อ DB ถ้าไม่เปิด `DATABASE_CONNECT_ON_BOOT`
- endpoint ที่พึ่ง database จริงยังต้องมี `DATABASE_URL` ที่ใช้งานได้

## AI Documentation

เอกสารสำหรับ AI agent แยกไว้ใต้ [ai/README.md](ai/README.md)

ถ้าคุณใช้ Copilot หรือ agent อื่นช่วยเขียนโค้ดใน repo นี้ ควรให้มันเริ่มอ่านจากชุดเอกสารในโฟลเดอร์ `ai/` ก่อน
