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
    
    // Handle different routes
    if (path.startsWith('/api/proxy')) {
      // Proxy requests
      const targetUrl = query.url;
      if (!targetUrl) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'URL parameter is required' })
        };
      }

      const axios = require('axios');
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: targetUrl,
          headers: {
            'User-Agent': headers['user-agent'] || 'Mozilla/5.0 (compatible; Proxy)',
            ...Object.fromEntries(
              Object.entries(headers).filter(([key]) => 
                !['host', 'x-forwarded-for', 'x-forwarded-proto'].includes(key.toLowerCase())
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
            'Access-Control-Allow-Headers': '*'
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
    } else if (path.startsWith('/api/health')) {
      // Health check
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
      };
    } else {
      // Default response
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Steam Reverse Proxy API',
          endpoints: ['/api/proxy', '/api/health'],
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
