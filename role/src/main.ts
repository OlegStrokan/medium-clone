import {NestFactory} from '@nestjs/core';
import {Transport, MicroserviceOptions} from '@nestjs/microservices';
import {ValidationPipe} from "@nestjs/common";
import {RoleModule} from "./role.module";
import {SeedService} from "./services/seed.service";


async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(RoleModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://guest:guest@localhost:5672'],
            queue: 'role_queue',
            queueOptions: {durable: false},
        },
    })

    const seedService = app.get(SeedService);
    await seedService.seedDatabase();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.listen();
}

bootstrap();
