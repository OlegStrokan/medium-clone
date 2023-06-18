import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SubscriptionController} from "./controllers/subscription.controller";
import {SubscriptionService} from "./services/subscription.service";
import {SubscriptionEntity} from "./repository/subscription.entity";
import {UserSubscriptionEntity} from "./repository/user-subscription.entity";

@Module({
    imports: [ClientsModule.register([
        {
            name: 'subscription_service',
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@localhost:5672'],
                queue: 'subscription_queue',
                queueOptions: {durable: false}
            },
        },
    ]),
        TypeOrmModule.forFeature([
            SubscriptionEntity,
            UserSubscriptionEntity
        ]),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: 'localhost',
            port: 5436,
            username: 'stroka01',
            password: 'subscription',
            database: 'subscription_db',
            entities: [
                SubscriptionEntity,
                UserSubscriptionEntity
            ],
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
})
export class SubscriptionModule {
}
