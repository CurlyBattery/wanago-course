import { Module } from '@nestjs/common';
import {
  JwtModule,
  JwtModuleAsyncOptions,
  JwtModuleOptions,
} from '@nestjs/jwt';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { HashModule } from '../hash/hash.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './guards/access.guard';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ({
          secret: envService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: `${envService.get('JWT_ACCESS_EXPIRATION_TIME')}m`,
          },
        }) as JwtModuleOptions,
    }),
    HashModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    AccessStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AuthenticationModule {}
