import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { SteamDomainsService } from './steam-domains.service';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService, SteamDomainsService],
})
export class ProxyModule {}