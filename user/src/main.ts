import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {UserModule} from "./user.module";
import {AllExceptionsFilter} from "./services/exception.service";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      UserModule,
      {
        transport: Transport.TCP,
      },
  );
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen();
}
bootstrap();
