import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EnvModule],
})
export class AppModule {}
