import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions } from '@nestjs/microservices';
import {ValidationPipe} from "@nestjs/common";
import {TokenModule} from "./token.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TokenModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'token_queue',
      queueOptions: { durable: false },
    },
  })

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
  );
  await app.listen();
}

bootstrap();
