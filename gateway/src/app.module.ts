import {Module} from "@nestjs/common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UsersController} from "./controllers/users.controller";
import {AuthController} from "./controllers/auth.controller";
import {SubscriptionsController} from "./controllers/subscriptions.controller";

@Module({
    imports: [ClientsModule.register([
        {
            name: 'user_service',
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: 'user_queue',
                queueOptions: {durable: false}
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
        },
        {
            name: 'role_service',
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: 'role_queue',
                queueOptions: {durable: false}
            },
        },
        {
            name: 'subscription_service',
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: 'subscription_queue',
                queueOptions: {durable: false}
            },
        }
    ]),],
    controllers: [UsersController, AuthController, SubscriptionsController],
  providers: []
})
export class AppModule {
}

