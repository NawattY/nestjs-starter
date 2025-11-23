import { BaseJwtPayload } from "#core/auth/jwt-base-payload.interface";

export interface JwtPayload extends BaseJwtPayload {
  roles?: string[]; // global roles
}
