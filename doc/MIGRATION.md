# 📦 Prisma Migration Commands

This project uses **Prisma Migrate** for database schema management.

> 📂 Migrations are stored in `src/database/migrations/`

---

## 📌 Create Migration (Development)

When you change `schema.prisma`, run:

```bash
npm run prisma:migrate
# OR
npx prisma migrate dev
```

> ✅ This will:
> 1. Generate SQL migration file
> 2. Apply it to your local database
> 3. Regenerate Prisma Client

---

## 🧱 Reset Database

To wipe all data and re-apply all migrations:

```bash
npx prisma migrate reset
```

---

## ▶️ Deploy Migration (Production)

To apply pending migrations in production (CI/CD):

```bash
npm run prisma:migrate:deploy
# OR
npx prisma migrate deploy
```

> ⚠️ This command does **NOT** generate new migrations. It only applies existing ones.

---

## 🛠 Scripts in package.json

```json
"scripts": {
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
}
```
