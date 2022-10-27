import {NestFactory} from '@nestjs/core';
import {RoleModule} from './role.module';
import {RmqOptions, Transport} from "@nestjs/microservices";
import {ConfigService} from "./services/config.service";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(RoleModule, {
        transport: Transport.RMQ,
        option: {
            host: '0.0.0.0',
            port: new ConfigService().get('port')
        }
    } as RmqOptions)
    await app.listen();
}

bootstrap();
