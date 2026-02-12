import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { UsersModule } from './users/users.module';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EnvModule,
    DatabaseModule,
    HashModule,
    UsersModule,
  ],
})
export class AppModule {}
