import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "./validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn','debug', 'log'],
  });


  app.useGlobalPipes(
      new ValidationPipe(),
  );

  await app.listen(8000);

}
bootstrap();
