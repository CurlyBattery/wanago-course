import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { cookieFactory, Public } from '@app/common';
import { RegisterDto } from './dtos/register.dto';
import { RequestWithUser } from './types/request-with-user.interface';
import { LocalGuard } from './guards/local.guard';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './constants';
import { RefreshGuard } from './guards/refresh.guard';
import { UsersService } from '../users/users.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Public()
  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieWithJwtWithAccess(
        user.id,
        user.email,
      );

    const refresh =
      await this.authenticationService.getCookieWithJwtWithRefresh(user.id);

    const cookies = cookieFactory(req, res);

    cookies.set(ACCESS_COOKIE, accessToken, cookieOptions);
    cookies.set(REFRESH_COOKIE, refresh.refreshToken, refresh.cookieOptions);

    return { accessToken };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = cookieFactory(req, res);
    const { user } = req;

    await this.usersService.removeRefreshToken(user.id);

    cookies.remove(ACCESS_COOKIE);
    cookies.remove(REFRESH_COOKIE);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = cookieFactory(req, res);
    const { user } = req;

    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieWithJwtWithAccess(
        user.id,
        user.email,
      );

    const refresh =
      await this.authenticationService.getCookieWithJwtWithRefresh(user.id);

    cookies.set(ACCESS_COOKIE, accessToken, cookieOptions);
    cookies.set(REFRESH_COOKIE, refresh.refreshToken, refresh.cookieOptions);

    return {
      accessToken,
    };
  }
}
