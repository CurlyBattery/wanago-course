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
import { RegisterDto } from './dtos/register.dto';
import { Public } from '@app/common';
import { cookieFactory } from '@app/common/auth/cookie.lib';
import { ACCESS_COOKIE, REFRESH_COOKIE, type RequestWithUser } from './types';
import { RefreshGuard } from './guards/refresh.guard';
import { LoginDto } from './dtos/login.dto';

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

    return {
      accessToken,
    };
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

    return {
      accessToken,
    };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieLib = cookieFactory(req, res);
    await this.authService.logout(req.user);

    cookieLib.remove(ACCESS_COOKIE);
    cookieLib.remove(REFRESH_COOKIE);
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

    return {
      accessToken,
    };
  }

  setTokensToCookie(
    req: Request,
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieLib = cookieFactory(req, res);

    cookieLib.set(ACCESS_COOKIE, accessToken, {
      maxAge: 15 * 60 * 1000,
    });
    cookieLib.set(REFRESH_COOKIE, refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
