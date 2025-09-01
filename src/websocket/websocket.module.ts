import { Module } from '@nestjs/common';
import { WebSocketProxyGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketProxyGateway],
})
export class WebSocketModule {}