export interface BaseJwtPayload {
  uid: string;
  sid: string;
  iat?: number;
  exp?: number;
}
