import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './entrypoints/web/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new ZodExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Kiosco API running on port ${port}`);
}

bootstrap();
