import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SteamDomainsService {
  private readonly logger = new Logger(SteamDomainsService.name);

  // Complete list of Steam domains that need proxying
  private readonly steamDomains = new Map<string, string>([
    // Content delivery and updates
    ['client-update.akamai.steamstatic.com', 'client-update.akamai.steamstatic.com'],
    ['clientconfig.akamai.steamstatic.com', 'clientconfig.akamai.steamstatic.com'],
    ['steampipe.akamaihd.net', 'steampipe.akamaihd.net'],
    ['steamcdn-a.akamaihd.net', 'steamcdn-a.akamaihd.net'],
    ['steamuserimages-a.akamaihd.net', 'steamuserimages-a.akamaihd.net'],
    
    // Core Steam services
    ['steamcommunity.com', 'steamcommunity.com'],
    ['store.steampowered.com', 'store.steampowered.com'],
    ['api.steampowered.com', 'api.steampowered.com'],
    ['steamstat.us', 'steamstat.us'],
    
    // Steam media and assets
    ['media.steampowered.com', 'media.steampowered.com'],
    ['cdn.akamai.steamstatic.com', 'cdn.akamai.steamstatic.com'],
    ['shared.akamai.steamstatic.com', 'shared.akamai.steamstatic.com'],
    ['community.akamai.steamstatic.com', 'community.akamai.steamstatic.com'],
    ['store.akamai.steamstatic.com', 'store.akamai.steamstatic.com'],
    
    // Steam workshop and community
    ['steamworkshop.com', 'steamworkshop.com'],
    ['steamcommunity-a.akamaihd.net', 'steamcommunity-a.akamaihd.net'],
    
    // Steam broadcasting and video
    ['broadcast.steampowered.com', 'broadcast.steampowered.com'],
    ['video.steampowered.com', 'video.steampowered.com'],
    
    // Steam partner and developer
    ['partner.steampowered.com', 'partner.steampowered.com'],
    ['steamworks.github.io', 'steamworks.github.io'],
    
    // Additional Steam infrastructure
    ['help.steampowered.com', 'help.steampowered.com'],
    ['support.steampowered.com', 'support.steampowered.com'],
    ['checkout.steampowered.com', 'checkout.steampowered.com'],
    ['login.steampowered.com', 'login.steampowered.com'],
  ]);

  getTargetDomain(requestedDomain: string): string | null {
    // Remove port if present
    const cleanDomain = requestedDomain?.split(':')[0];
    
    if (!cleanDomain) {
      return null;
    }

    // Check if it's a known Steam domain
    const targetDomain = this.steamDomains.get(cleanDomain);
    
    if (targetDomain) {
      this.logger.debug(`Mapping ${cleanDomain} -> ${targetDomain}`);
      return targetDomain;
    }

    // Check for subdomain patterns
    for (const [pattern, target] of this.steamDomains.entries()) {
      if (cleanDomain.endsWith(pattern) || pattern.includes(cleanDomain)) {
        this.logger.debug(`Pattern match ${cleanDomain} -> ${target}`);
        return target;
      }
    }

    this.logger.warn(`Unknown domain requested: ${cleanDomain}`);
    return null;
  }

  getAllDomains(): string[] {
    return Array.from(this.steamDomains.keys());
  }
}