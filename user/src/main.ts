import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions } from '@nestjs/microservices';
import {ValidationPipe} from "@nestjs/common";
import {UserModule} from "./user.module";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://guest:guest@localhost:5672'],
            queue: 'user_queue',
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
