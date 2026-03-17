import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Create NestJS app
  const app = await NestFactory.create(ApiModule, {
    logger: new ConsoleLogger({ json: true, colors: true }),
  });

  // Middlewares
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));

  // Listen on a port
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API is running on http://localhost:${port}`);
}

bootstrap();
