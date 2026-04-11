import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/entrypoints/web/exception.filter';
import { ResponseInterceptor } from '../src/entrypoints/web/response.interceptor';

const expressServer = express();
let isInitialized = false;

async function bootstrap() {
  if (!isInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
      { logger: ['error', 'warn'] },
    );

    const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
      credentials: true,
    });

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();
    isInitialized = true;
  }

  return expressServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}
