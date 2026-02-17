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
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { ACCESS_COOKIE, REFRESH_COOKIE, RequestWithUser } from './types';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { cookieLib, Public } from '@app/common';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
    );

    this.setTokensToCookie(req, res, accessToken, refreshToken);

    return { accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user);

    const cookieFactory = cookieLib(req, res);
    cookieFactory.remove(REFRESH_COOKIE);
    cookieFactory.remove(ACCESS_COOKIE);

    return { message: 'Successfully logged out' };
  }

  setTokensToCookie(
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieFactory = cookieLib(req, res);
    cookieFactory.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    cookieFactory.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
