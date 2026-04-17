# AI Documentation Index

เอกสารสำหรับ AI agent ใน repository นี้ต้องอ่านจากโฟลเดอร์ `ai/` เป็นหลัก
เป้าหมายของเอกสารชุดนี้คือช่วยให้ AI เขียน แก้ และรีวิวโค้ดให้สอดคล้องกับ architecture, coding standards, และ workflow ของโปรเจกต์

## Read Order

1. `ai/architecture-rules.md`
2. `ai/coding-standards.md`
3. `ai/project-overview.md`
4. `ai/current-repo-reference.md`
5. `ai/database-migrations.md`
6. `ai/database-seeding.md`
7. `ai/core-logger.md`
8. `ai/core-mailer.md`
9. `ai/architecture-follow-up.md` (historical context)
10. `ai/codebase-alignment-phase-plan.md` (historical context)

## Source of Truth Priority

เมื่อข้อมูลขัดกัน ให้ยึดลำดับนี้:

1. `openapi/openapi.yaml` สำหรับ API contract
2. `ai/architecture-rules.md` และ `ai/coding-standards.md` สำหรับข้อบังคับด้านโครงสร้างและสไตล์
3. `ai/project-overview.md` และ `ai/current-repo-reference.md` สำหรับ workflow และข้อเท็จจริงของ repo ปัจจุบัน
4. `ai/architecture-follow-up.md` และ `ai/codebase-alignment-phase-plan.md` สำหรับ project context, trade-off, และ migration history
5. source code ปัจจุบันใน `src/` และ `test/` สำหรับ implementation detail ที่ใช้งานจริง

## Important Notes For AI

- โปรเจกต์นี้ไม่ใช้ project-wide import alias แล้ว ให้ใช้ relative imports ตามตำแหน่งไฟล์จริง
- request DTO validation ใช้ `class-validator`
- env/config validation ใช้ `zod`
- API documentation ใช้ OpenAPI-first โดยมี `openapi/openapi.yaml` เป็น canonical contract
- Scalar เป็นเพียง renderer ของ OpenAPI ไม่ใช่ source of truth
- เอกสารที่มีคำว่า historical context มีไว้เพื่อเข้าใจเหตุผลและ trade-off เดิม ไม่ใช่ข้อบังคับลำดับแรก
- ถ้าจะเพิ่มเอกสารใหม่สำหรับ AI ให้เพิ่มไว้ใต้ `ai/` เท่านั้น เว้นแต่เป็น non-Markdown artifact เช่น `openapi/openapi.yaml`