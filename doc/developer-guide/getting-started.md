# Getting Started

## 1. Install dependencies

```bash
npm install
npm run prepare # Install husky hooks
```

## 2. Environment Setup

1. Copy `.env.example` to `.env`
2. Update database connection string in `.env`

## 3. Database Setup

```bash
npm run prisma:migrate # Create tables
npm run seed           # Seed initial data
```

## 4. Run Application

```bash
npm run start:dev
```

