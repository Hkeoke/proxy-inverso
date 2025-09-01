import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Steam Reverse Proxy',
      version: '1.0.0',
    };
  }

  @Get('domains')
  getDomains() {
    return {
      message: 'Steam domains being proxied',
      domains: [
        'client-update.akamai.steamstatic.com',
        'clientconfig.akamai.steamstatic.com',
        'steampipe.akamaihd.net',
        'steamcdn-a.akamaihd.net',
        'steamuserimages-a.akamaihd.net',
        'steamcommunity.com',
        'store.steampowered.com',
        'api.steampowered.com',
        'media.steampowered.com',
        'cdn.akamai.steamstatic.com',
        'shared.akamai.steamstatic.com',
        'community.akamai.steamstatic.com',
        'store.akamai.steamstatic.com',
        'steamworkshop.com',
        'steamcommunity-a.akamaihd.net',
        'broadcast.steampowered.com',
        'video.steampowered.com',
        'partner.steampowered.com',
        'help.steampowered.com',
        'support.steampowered.com',
        'checkout.steampowered.com',
        'login.steampowered.com',
      ],
    };
  }
}