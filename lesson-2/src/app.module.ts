import { Module } from '@nestjs/common';
import * as Joi from 'joi';

import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
