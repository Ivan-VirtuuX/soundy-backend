import { Module } from '@nestjs/common';
import { MessengerGateway } from './messenger.gateway';

@Module({
  providers: [MessengerGateway],
})
export class GatewayModule {}
