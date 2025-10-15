import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dtos/register.dto';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './types/token-payload.interface';
import { addMinutes, differenceInMilliseconds } from 'date-fns';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    return user;
  }

  async getAutenticatedUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const isPasswordMatching = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials');
    }

    return user;
  }

  async getCookieWithJwt(userId: number) {
    const payload: TokenPayload = { userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      cookieOptions: {
        httpOnly: true,
        path: '/',
        maxAge: differenceInMilliseconds(
          addMinutes(
            new Date(),
            Number(this.configService.get('JWT_EXPIRATION_TIME')),
          ),
          new Date(),
        ),
      },
    };
  }

  async getCookieForLogOut() {
    return {
      accessToken: '',
      cookieOptions: {
        httpOnly: true,
        path: '/',
        maxAge: 0,
      },
    };
  }
}
