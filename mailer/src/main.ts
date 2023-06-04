import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailerModule } from './mailer.module';
import { config } from 'dotenv';

async function bootstrap() {

  config();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailerModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'mailer_queue',
      queueOptions: { durable: false },
    },
  });
  await app.listen();

}
bootstrap();
