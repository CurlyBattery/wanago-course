import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { EnvModule } from './env/env.module';
import { HashModule } from './hash/hash.module';
import { PostsModule } from './posts/posts.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EnvModule,
    HashModule,
    S3Module,
    UsersModule,
    AuthenticationModule,
    PostsModule,
  ],
})
export class AppModule {}
