import type { Request } from 'express';
import { UserEntity } from '../../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

export interface AccessPayload {
  sub: number;
  email: string;
}

export interface RefreshPayload {
  userId: number;
}

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';
