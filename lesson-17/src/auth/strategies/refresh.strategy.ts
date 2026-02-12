import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import { EnvService } from '../../env/env.service';
import { REFRESH_COOKIE, RefreshPayload } from '../types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[REFRESH_COOKIE],
      secretOrKey: envService.get('REFRESH_SECRET')!,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshPayload) {
    const refreshToken = req.cookies[REFRESH_COOKIE];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return this.authService.validateUserByRefresh(payload, refreshToken);
  }
}
