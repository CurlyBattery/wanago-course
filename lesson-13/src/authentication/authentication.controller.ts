import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  async login() {}

  @Get('me')
  me() {}

  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout() {}
}
