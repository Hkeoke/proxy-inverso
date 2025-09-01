const serverlessExpress = require('@vendia/serverless-express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');
const compression = require('compression');
const helmet = require('helmet');

let cachedServer;

async function createServer() {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    
    // Security middleware
    nestApp.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }));

    // Compression middleware
    nestApp.use(compression());

    // Enable CORS for all origins
    nestApp.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
      allowedHeaders: ['*'],
      credentials: true,
    });

    // Trust proxy headers
    nestApp.getHttpAdapter().getInstance().set('trust proxy', 1);

    await nestApp.init();
    
    const expressApp = nestApp.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ 
      app: expressApp,
      eventSourceRoutes: {
        'netlify': '/.*'
      }
    });
  }
  
  return cachedServer;
}

exports.handler = async (event, context) => {
  // Add Netlify-specific event source detection
  if (!event.httpMethod && !event.requestContext) {
    event.httpMethod = 'GET';
    event.path = event.path || '/';
    event.headers = event.headers || {};
    event.queryStringParameters = event.queryStringParameters || {};
  }
  
  const server = await createServer();
  return server(event, context);
};
