import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE')
    private readonly subscribersService: ClientProxy,
  ) {}

  @Get()
  async getAllSubscribers() {
    return this.subscribersService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }

  @Post()
  async addSubscriber(@Body() dto: CreateSubscriberDto) {
    return this.subscribersService.send(
      {
        cmd: 'add-subscriber',
      },
      dto,
    );
  }
}
