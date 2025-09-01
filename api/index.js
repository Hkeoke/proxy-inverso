const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const compression = require('compression');
const helmet = require('helmet');

let app;

async function createNestApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Security middleware
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }));

    // Compression middleware
    app.use(compression());

    // Enable CORS for all origins
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
      allowedHeaders: ['*'],
      credentials: true,
    });

    // Trust proxy headers
    app.set('trust proxy', 1);

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  const nestApp = await createNestApp();
  return nestApp.getHttpAdapter().getInstance()(req, res);
};
