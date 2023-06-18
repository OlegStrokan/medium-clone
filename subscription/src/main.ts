import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions } from '@nestjs/microservices';
import {ValidationPipe} from "@nestjs/common";
import {SubscriptionModule} from "./subscription.module";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SubscriptionModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'user_role_queue',
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
