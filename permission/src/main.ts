import { NestFactory } from '@nestjs/core';
import {PermissionModule} from "./permission.module";
import {Transport} from "@nestjs/microservices";
import {ConfigService} from "./services/config.service";

async function bootstrap() {
 const app = await NestFactory.createMicroservice(PermissionModule, {
     transport: Transport.RMQ,
     options: {
         host: '0.0.0.0',
         port: new ConfigService().get('port')
     }
 })
}
bootstrap();
