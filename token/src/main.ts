import {NestFactory} from '@nestjs/core';
import {Transport, RmqOptions} from "@nestjs/microservices";
import {ConfigService} from "./services/config.service";
import {TokenModule} from "./token.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.RMQ,
    option: {
      host: '0.0.0.0',
      port: new ConfigService().get('port')
    }
  } as RmqOptions)
  await app.listen();
}

bootstrap();
