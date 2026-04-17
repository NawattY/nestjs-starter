import { BaseJwtPayload } from './jwt-base-payload.interface';

export interface JwtPayload extends BaseJwtPayload {
  roles?: string[];
}