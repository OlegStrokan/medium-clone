import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn','debug', 'log'],
  });


  const options = new DocumentBuilder()
      .setTitle('Medium clone')
      .setDescription('Actually this is not medium clone:)')
      .setVersion('1.0')
      .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, options);

  // Serve Swagger UI
  SwaggerModule.setup('api', app, document);

  // Enable CORS with specific options
  app.enableCors()

  await app.listen(8000);

}
bootstrap();
