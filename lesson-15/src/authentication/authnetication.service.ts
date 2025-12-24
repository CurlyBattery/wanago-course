import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { EnvService } from '../env/env.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { AccessPayload, RefreshPayload } from './types';
import { Express } from 'express';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly envService: EnvService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly s3Service: S3Service,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await this.hashService.hash(registerDto.password);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.getTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const matchingPassword = await this.hashService.verify(
      loginDto.password,
      user.password,
    );
    if (!matchingPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.getTokens(user);
  }

  async logout(user: User) {
    await this.usersService.setRefreshToken(user.id, null);
  }

  refresh(user: User) {
    return this.getTokens(user);
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const avatarUrl = await this.s3Service.uploadAvatar(userId, file);

    await this.usersService.updateAvatarUrl(userId, avatarUrl);

    return avatarUrl;
  }

  async getTokens(user: User) {
    const accessPayload: AccessPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(accessPayload);

    const refreshPayload = { userId: user.id };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.envService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.envService.get('JWT_REFRESH_EXPIRATION_TIME')}d`,
    } as JwtSignOptions);

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByAccess(payload: AccessPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateUserByRefresh(payload: RefreshPayload) {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
