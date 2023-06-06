import {Module} from "@nestjs/common";
import {ClientProxyFactory, ClientsModule, Transport} from "@nestjs/microservices";
import {UsersController} from "./controllers/users.controller";
import {AuthController} from "./controllers/auth.controller";

@Module({
  imports: [ClientsModule.register([
    {
      name: 'user_service',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'user_queue',
        queueOptions: { durable: false }
      },
    },
    {
      name: 'token_service',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'token_queue',
        queueOptions: {durable: false}
      },
    },
    {
      name: 'mailer_service',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'mailer_queue',
        queueOptions: {durable: false}
      },
    }
  ]),],
  controllers: [UsersController, AuthController],
  providers: []
})
export class AppModule {}

