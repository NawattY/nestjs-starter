# Module Pattern

## Purpose
Modules encapsulate business logic per feature.

## Structure
- domain/
- datasources/
- services/
- dto/
- module.ts

## Rules
- Services never access Prisma directly.
- Datasources implement interfaces.
