import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('DATABASE_HOST'),
        port: +envService.get('DATABASE_PORT')!,
        username: envService.get('DATABASE_USERNAME'),
        password: envService.get('DATABASE_PASSWORD'),
        database: envService.get('DATABASE_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
