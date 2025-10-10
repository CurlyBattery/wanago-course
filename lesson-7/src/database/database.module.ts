import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { AddressEntity } from '../users/entities/address.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { CategoryEntity } from '../categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [UserEntity, AddressEntity, PostEntity, CategoryEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
