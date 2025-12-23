import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('POSTGRES_HOST'),
        port: +envService.get('POSTGRES_PORT'),
        database: envService.get('POSTGRES_DB'),
        username: envService.get('POSTGRES_USER'),
        password: envService.get('POSTGRES_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
