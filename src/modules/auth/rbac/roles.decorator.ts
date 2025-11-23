import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AppRole = 'admin' | 'customer'; // global roles (non-merchant)
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
