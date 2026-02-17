import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { HashModule } from '../hash/hash.module';
import { AccessStrategy } from './strategies/access.strategy';
import { AccessGuard } from './guards/access.guard';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { RefreshGuard } from './guards/refresh.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ({
          secret: envService.get('ACCESS_SECRET'),
          signOptions: {
            expiresIn: `${envService.get('ACCESS_EXP')}m`,
          },
        }) as JwtModuleOptions,
    }),
    HashModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    RefreshStrategy,
    RefreshGuard,
  ],
})
export class AuthModule {}
