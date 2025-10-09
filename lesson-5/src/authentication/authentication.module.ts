import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}m`,
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
