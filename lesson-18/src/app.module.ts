import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SubscribersModule } from './subscribers/subscribers.module';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    SubscribersModule,
  ],
})
export class AppModule {}
