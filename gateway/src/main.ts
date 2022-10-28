import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "./services/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const config = new DocumentBuilder()
      .setTitle("Medium")
      .setDescription("REST API documentation")
      .setVersion("1.0.0")
      .addTag("Oleh")
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);


  app.useGlobalPipes(new ValidationPipe());

  await app.listen(new ConfigService().get('port'))
}
bootstrap();
