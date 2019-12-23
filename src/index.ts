import { resolve } from 'path';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

config({
  path: resolve(__dirname, '../env/.env')
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀Start listening on port ${port}`);
  });
}

bootstrap();
