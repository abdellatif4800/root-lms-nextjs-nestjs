interface BaseAuthPayload {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface UserAuthPayload extends BaseAuthPayload {
  role: UserRole.USER;
}

export interface AdminAuthPayload extends BaseAuthPayload {
  role: UserRole.ADMIN;
}

export type AuthUserPayload = UserAuthPayload | AdminAuthPayload;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}
