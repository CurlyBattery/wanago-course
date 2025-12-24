import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authnetication.service';
import { AuthenticationController } from './authentication.controller';
import { EnvModule } from '../env/env.module';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { HashModule } from '../hash/hash.module';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './guards/access.guard';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    UsersModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ({
          secret: envService.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: `${envService.get('JWT_ACCESS_EXPIRATION_TIME')}m`,
          },
        }) as JwtModuleAsyncOptions,
    }),
    HashModule,
    S3Module,
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
