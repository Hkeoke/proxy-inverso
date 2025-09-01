import {
  Controller,
  All,
  Req,
  Res,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { SteamDomainsService } from './steam-domains.service';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly steamDomainsService: SteamDomainsService,
  ) {}

  @All('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const host = req.get('host');
      const originalHost = req.get('x-original-host') || host;
      
      this.logger.debug(`Incoming request: ${req.method} ${req.url}`);
      this.logger.debug(`Host: ${host}, Original Host: ${originalHost}`);

      // Determine target Steam domain
      const targetDomain = this.steamDomainsService.getTargetDomain(originalHost);
      
      if (!targetDomain) {
        throw new HttpException(
          `Unsupported domain: ${originalHost}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Proxy the request
      await this.proxyService.forwardRequest(req, res, targetDomain);
      
    } catch (error) {
      this.logger.error(`Proxy error: ${error.message}`, error.stack);
      
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Proxy Error',
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
}