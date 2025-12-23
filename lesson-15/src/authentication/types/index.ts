import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface AccessPayload {
  sub: number;
  email: string;
}

export interface RefreshPayload {
  userId: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
