## 📦 TypeORM Migration Commands

ชุดคำสั่งที่ใช้ในการจัดการ Migration ด้วย TypeORM และ NestJS

> 📂 ไฟล์ migration จะถูกสร้างไว้ใน `src/database/migrations/`

---

### 📌 สร้างไฟล์ Migration (จาก Entity ที่เปลี่ยนแปลง)
```bash
npm run migration:generate --name=create-user-table
```
> ✅ สร้างไฟล์ migration พร้อม SQL changes อัตโนมัติ

---

### 🧱 สร้างไฟล์ Migration เปล่า (เพื่อเขียน SQL เอง)
```bash
npm run migration:create --name=custom-migration-name
```

---

### ▶️ รัน Migration ที่ยังไม่ถูกรัน
```bash
npm run migration:run
```

---

### ⏪ ย้อนกลับ Migration ล่าสุด
```bash
npm run migration:revert
```

---

### 📋 แสดงรายการ Migration ที่ยังไม่ถูกรัน
```bash
npm run migration:list
```

---

### 🛠 Scripts ที่ตั้งไว้ใน package.json
```json
"scripts": {
  "migration:generate": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./src/database/data-source.ts src/database/migrations/$npm_config_name",
  "migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create -d ./src/database/data-source.ts src/database/migrations/$npm_config_name",
  "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/database/data-source.ts",
  "migration:revert": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./src/database/data-source.ts",
  "migration:list": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:show -d ./src/database/data-source.ts",
  "seed": "ts-node -r tsconfig-paths/register src/database/seeders/$npm_config_file"
}
```
