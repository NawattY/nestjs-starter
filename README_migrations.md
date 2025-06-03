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
  "typeorm": "typeorm-ts-node-commonjs",
  "migration:generate": "typeorm-ts-node-commonjs migration:generate -d ./src/database/orm.config.ts src/database/migrations/$npm_config_name",
  "migration:create": "typeorm-ts-node-commonjs migration:create -d ./src/database/orm.config.ts src/database/migrations/$npm_config_name",
  "migration:run": "typeorm-ts-node-commonjs migration:run -d ./src/database/orm.config.ts",
  "migration:revert": "typeorm-ts-node-commonjs migration:revert -d ./src/database/orm.config.ts",
  "migration:list": "typeorm-ts-node-commonjs migration:show -d ./src/database/orm.config.ts"
}
```