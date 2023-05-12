import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions, RmqOptions} from '@nestjs/microservices';
import {AllExceptionsFilter} from "./services/exception.service";
import {ValidationPipe} from "@nestjs/common";
import {UserModule} from "./user.module";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 3001,
        }
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
