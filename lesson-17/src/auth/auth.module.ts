import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AccessStrategy } from './strategies/access.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { AccessGuard } from './guards/access.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { HashModule } from '../hash/hash.module';

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
        }) as JwtModuleAsyncOptions,
    }),
    HashModule,
  ],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    RefreshGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
