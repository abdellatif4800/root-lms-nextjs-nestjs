import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import {
  ConsoleLogger,
  ValidationPipe,
  INestApplication,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';

// Helper function to apply your middlewares and configs consistently
function configureApp(app: INestApplication) {
  // Middlewares
  app.use(cookieParser());

  // Enable CORS
  // Note: Don't forget to add your live frontend URL here for production!
  app.enableCors({
    origin: true,
    //origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
}

let cachedApp: any;

// 1. Setup for Vercel Serverless Functions
async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(ApiModule, {
      logger: new ConsoleLogger({ json: true, colors: true }),
    });

    configureApp(app);

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

// 2. Setup for Local Development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  async function startLocal() {
    const app = await NestFactory.create(ApiModule, {
      logger: new ConsoleLogger({ json: true, colors: true }),
    });

    configureApp(app);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`API is running locally on http://localhost:${port}`);
  }

  startLocal();
}

// 3. The Required Vercel Export
export default async function handler(req: any, res: any) {
  const app = await bootstrapServer();
  return app(req, res);
}

// import { NestFactory } from '@nestjs/core';
// import { ApiModule } from './api.module';
// import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';
//
// async function bootstrap() {
//   // Create NestJS app
//   const app = await NestFactory.create(ApiModule, {
//     logger: new ConsoleLogger({ json: true, colors: true }),
//   });
//
//   // Middlewares
//   app.use(cookieParser());
//
//   // Enable CORS
//   app.enableCors({
//     origin: ['http://localhost:3001', 'http://localhost:3000'],
//     credentials: true,
//   });
//
//   // Global validation pipes
//   app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
//
//   // Listen on a port
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//
//   console.log(`API is running on http://localhost:${port}`);
// }
//
// bootstrap();
