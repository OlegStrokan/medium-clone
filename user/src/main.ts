import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {UserModule} from "./user.module";
import {AllExceptionsFilter} from "./services/exception.service";
import {ValidationPipe} from "@nestjs/common";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      UserModule,
      {
        transport: Transport.TCP,
      },
  );
  app.useGlobalFilters(new AllExceptionsFilter())
    app.useGlobalPipes(  new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
    }));
  await app.listen();
}
bootstrap();
