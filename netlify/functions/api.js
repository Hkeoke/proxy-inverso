const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
      allowedHeaders: ['*'],
      credentials: true,
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

exports.handler = async (event, context) => {
  try {
    const app = await bootstrap();
    
    // Extract path from event
    const path = event.path || event.rawUrl || '/';
    const method = event.httpMethod || 'GET';
    const headers = event.headers || {};
    const query = event.queryStringParameters || {};
    
    // Map Steam domains to original URLs
    const steamDomains = {
      'client-update.akamai.steamstatic.com': 'https://client-update.akamai.steamstatic.com',
      'clientconfig.akamai.steamstatic.com': 'https://clientconfig.akamai.steamstatic.com',
      'steampipe.akamaihd.net': 'https://steampipe.akamaihd.net',
      'steamcdn-a.akamaihd.net': 'https://steamcdn-a.akamaihd.net',
      'steamuserimages-a.akamaihd.net': 'https://steamuserimages-a.akamaihd.net',
      'steamcommunity.com': 'https://steamcommunity.com',
      'store.steampowered.com': 'https://store.steampowered.com',
      'api.steampowered.com': 'https://api.steampowered.com',
      'media.steampowered.com': 'https://media.steampowered.com',
      'cdn.akamai.steamstatic.com': 'https://cdn.akamai.steamstatic.com',
      'shared.akamai.steamstatic.com': 'https://shared.akamai.steamstatic.com',
      'community.akamai.steamstatic.com': 'https://community.akamai.steamstatic.com',
      'store.akamai.steamstatic.com': 'https://store.akamai.steamstatic.com',
      'steamworkshop.com': 'https://steamworkshop.com',
      'steamcommunity-a.akamaihd.net': 'https://steamcommunity-a.akamaihd.net',
      'broadcast.steampowered.com': 'https://broadcast.steampowered.com',
      'video.steampowered.com': 'https://video.steampowered.com',
      'partner.steampowered.com': 'https://partner.steampowered.com',
      'help.steampowered.com': 'https://help.steampowered.com',
      'support.steampowered.com': 'https://support.steampowered.com',
      'checkout.steampowered.com': 'https://checkout.steampowered.com',
      'login.steampowered.com': 'https://login.steampowered.com'
    };

    // Get the host from headers
    const host = headers.host || headers.Host;
    
    if (path.startsWith('/api/health')) {
      // Health check
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
      };
    } else if (steamDomains[host]) {
      // Direct proxy for Steam domains
      const targetUrl = steamDomains[host] + path + (event.rawQuery ? '?' + event.rawQuery : '');
      
      const axios = require('axios');
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: targetUrl,
          headers: {
            'User-Agent': headers['user-agent'] || 'Mozilla/5.0 (compatible; Steam Proxy)',
            ...Object.fromEntries(
              Object.entries(headers).filter(([key]) => 
                !['host', 'x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-host'].includes(key.toLowerCase())
              )
            )
          },
          data: event.body ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body) : undefined,
          timeout: 30000,
          validateStatus: () => true
        });

        return {
          statusCode: response.status,
          headers: {
            'Content-Type': response.headers['content-type'] || 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            ...Object.fromEntries(
              Object.entries(response.headers).filter(([key]) => 
                !['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())
              )
            )
          },
          body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Proxy request failed', details: error.message })
        };
      }
    } else {
      // Default response
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Steam Reverse Proxy API',
          host: host,
          path: path,
          availableDomains: Object.keys(steamDomains),
          timestamp: new Date().toISOString()
        })
      };
    }
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
