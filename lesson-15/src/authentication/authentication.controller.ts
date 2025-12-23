import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthenticationService } from './authnetication.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { cookieFactory } from '@app/app';
import { ACCESS_COOKIE, REFRESH_COOKIE, RequestWithUser } from './types';
import { RefreshGuard } from './guards/refresh.guard';
import { Public } from '@app/app/auth/public.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationService.register(registerDto);

    this.setTokensToCookies(accessToken, refreshToken, req, res);

    return { accessToken };
  }

  @Public()
  @Post('log-in')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationService.login(loginDto);

    this.setTokensToCookies(accessToken, refreshToken, req, res);

    return { accessToken };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationService.refresh(req.user);

    this.setTokensToCookies(accessToken, refreshToken, req, res);

    return { accessToken };
  }

  @UseGuards(RefreshGuard)
  @Post('log-out')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieLib = cookieFactory(req, res);

    await this.authenticationService.logout(req.user);

    cookieLib.remove(ACCESS_COOKIE);
    cookieLib.remove(REFRESH_COOKIE);
  }

  setTokensToCookies(
    accessToken: string,
    refreshToken: string,
    req: Request,
    res: Response,
  ) {
    const cookieLib = cookieFactory(req, res);

    cookieLib.set(ACCESS_COOKIE, accessToken);
    cookieLib.set(REFRESH_COOKIE, refreshToken);
  }
}
