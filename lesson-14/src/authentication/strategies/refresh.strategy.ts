import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { ACCESS_COOKIE, REFRESH_COOKIE } from '../constants';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayload } from '../types/refresh-token.payload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies[REFRESH_COOKIE];
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: RefreshTokenPayload) {
    const refreshToken = request.cookies[REFRESH_COOKIE];
    return this.usersService.getUserIfRefreshTokenMathces(
      payload.userId,
      refreshToken,
    );
  }
}
