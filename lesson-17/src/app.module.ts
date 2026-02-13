import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-s3';

import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { UsersModule } from './users/users.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import { EnvService } from './env/env.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EnvModule,
    DatabaseModule,
    HashModule,
    MinioModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        endpoint: envService.get('MINIO_ENDPOINT')!,
        accessKey: envService.get('MINIO_USER')!,
        secretKey: envService.get('MINIO_PASSWORD')!,
        region: envService.get('MINIO_REGION') || 'us-east-1',
        buckets: [{ name: 'avatars', policy: 'public' }],
      }),
    }),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
