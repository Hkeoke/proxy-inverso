import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  async forwardRequest(
    req: Request,
    res: Response,
    targetDomain: string,
  ): Promise<void> {
    try {
      const targetUrl = `https://${targetDomain}${req.url}`;
      
      this.logger.debug(`Forwarding to: ${targetUrl}`);

      // Prepare headers for the target request
      const headers = this.prepareHeaders(req, targetDomain);

      // Make the request to Steam
      const response: AxiosResponse = await axios({
        method: req.method as any,
        url: targetUrl,
        headers,
        data: req.body,
        responseType: 'stream',
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: () => true, // Accept all status codes
      });

      // Forward response headers
      this.forwardResponseHeaders(response, res);

      // Set status code
      res.status(response.status);

      // Stream the response
      response.data.pipe(res);

    } catch (error) {
      this.logger.error(`Request forwarding failed: ${error.message}`);
      throw error;
    }
  }

  private prepareHeaders(req: Request, targetDomain: string): Record<string, string> {
    const headers: Record<string, string> = {};

    // Copy relevant headers
    const allowedHeaders = [
      'accept',
      'accept-encoding',
      'accept-language',
      'cache-control',
      'content-type',
      'content-length',
      'user-agent',
      'authorization',
      'cookie',
      'if-modified-since',
      'if-none-match',
      'range',
    ];

    allowedHeaders.forEach(header => {
      const value = req.get(header);
      if (value) {
        headers[header] = value;
      }
    });

    // Set correct host header
    headers['host'] = targetDomain;

    // Remove proxy-specific headers
    delete headers['x-forwarded-for'];
    delete headers['x-forwarded-proto'];
    delete headers['x-forwarded-host'];

    return headers;
  }

  private forwardResponseHeaders(response: AxiosResponse, res: Response): void {
    // Headers to forward back to client
    const headersToForward = [
      'content-type',
      'content-length',
      'content-encoding',
      'content-disposition',
      'cache-control',
      'expires',
      'last-modified',
      'etag',
      'set-cookie',
      'location',
    ];

    headersToForward.forEach(header => {
      const value = response.headers[header];
      if (value) {
        res.set(header, value);
      }
    });

    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', '*');
  }
}