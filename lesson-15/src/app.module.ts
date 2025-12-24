import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { EnvModule } from './env/env.module';
import { HashModule } from './hash/hash.module';
import { PostsModule } from './posts/posts.module';
import { EnvService } from './env/env.service';
import { MinioModule } from '@app/minio';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MinioModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        endpoint: envService.get('MINIO_ENDPOINT'),
        accessKey: envService.get('MINIO_USER'),
        secretKey: envService.get('MINIO_PASSWORD'),
        region: envService.get('MINIO_REGION') || 'us-east-1',
        buckets: [{ name: 'avatars', policy: 'public' }],
      }),
    }),
    DatabaseModule,
    EnvModule,
    HashModule,
    UsersModule,
    AuthenticationModule,
    PostsModule,
  ],
})
export class AppModule {}
