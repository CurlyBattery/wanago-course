import { SubscribersService } from './subscribers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscribersController } from './subscribers.controller';
import { Subscriber } from './entities/subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscribersService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
