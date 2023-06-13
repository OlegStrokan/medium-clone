import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRolesController} from "./controllers/user-roles.controller";
import {UserRolesService} from "./services/user-roles.service";

@Module({
  imports: [ClientsModule.register([
    {
      name: 'role_service',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'role_queue',
        queueOptions: { durable: false }
      },
    },
  ]),
    TypeOrmModule.forFeature([

    ]),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: 'localhost',
      port: 5436,
      username: 'stroka01',
      password: 'user_role',
      database: 'user_role_db',
      entities: [

      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {
}
