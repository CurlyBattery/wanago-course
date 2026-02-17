import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';

import { Subscriber } from './entities/subscriber';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscribersRepository: Repository<Subscriber>,
  ) {}

  async addSubscriber(createSubscriberDto: CreateSubscriberDto) {
    const newSubscriber =
      this.subscribersRepository.create(createSubscriberDto);
    await this.subscribersRepository.save(newSubscriber);
    return newSubscriber;
  }

  async getAllSubscribers() {
    return this.subscribersRepository.find();
  }
}
