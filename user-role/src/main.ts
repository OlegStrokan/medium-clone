import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions } from '@nestjs/microservices';
import {ValidationPipe} from "@nestjs/common";
import {UserRolesModule} from "./user-roles.module";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserRolesModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'user_roles_queue',
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
