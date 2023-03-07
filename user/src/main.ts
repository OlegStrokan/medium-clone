import {NestFactory} from '@nestjs/core';
import {UserModule} from './user.module';
import {Transport, RmqOptions} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(UserModule, {
        transport: Transport.RMQ,
        option: {
            urls: ['amqp://localhost:5672'],
            queue: 'rabbitmq',
            queueOptions: {
                durable: false
            },
        }
    } as RmqOptions)
    await app.listen();
}

 bootstrap();
