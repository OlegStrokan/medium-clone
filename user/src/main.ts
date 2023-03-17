import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {UserModule} from "./user.module";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      UserModule,
      {
        transport: Transport.TCP,
      },
  );
  await app.listen();
}
bootstrap();
