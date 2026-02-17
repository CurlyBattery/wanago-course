import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscribersController } from './subscribers.controller';

@Module({
  controllers: [SubscribersController],
  providers: [
    {
      provide: 'SUBSCRIBERS_SERVICE',
      inject: [EnvService],
      useFactory: (envService: EnvService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: envService.get('SUBSCRIBERS_SERVICE_HOST'),
            port: +envService.get('SUBSCRIBERS_SERVICE_PORT'),
          },
        }),
    },
  ],
})
export class SubscribersModule {}
